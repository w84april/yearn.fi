import { z } from 'zod'
import fixture from '@/server/senior/liveData.fixture.json'

const status = z.enum(['available', 'partial', 'unavailable', 'prelaunch'])
const mode = z.enum(['fixture', 'kong', 'prelaunch'])
const address = z
  .string()
  .regex(/^0x[a-f0-9]{40}$/i)
  .nullable()
const amount = z.number().nullable()
const observation = z.object({
  source: z.enum(['fixture', 'kong']),
  url: z.string().nullable(),
  status: z.enum(['available', 'stale', 'unverified', 'unavailable']),
  blockNumber: amount,
  observedAt: z.iso.datetime().nullable()
})
const envelope = z.object({
  version: z.literal(1),
  mode,
  status,
  market: z.object({ chainId: z.literal(1), asset: z.literal('USDC'), controller: address })
})
const tranche = z.object({
  address,
  claim: amount,
  covered: amount.optional(),
  coverage: amount,
  targetApr: amount,
  accrualPaused: z.boolean().nullable()
})
const allocation = z.object({
  name: z.string(),
  address,
  amount: z.number(),
  share: amount,
  lastReportAt: z.iso.datetime().nullable()
})
const capitalAmount = z.number().nonnegative().nullable()
const snapshotSchema = envelope.extend({
  juniorCapital: observation
    .extend({
      data: z.object({
        tvl: capitalAmount,
        fixedTvl: capitalAmount,
        leveredTvl: capitalAmount,
        equityTvl: capitalAmount,
        withdrawalsInCooldown: capitalAmount
      })
    })
    .nullish(),
  accounting: observation
    .extend({
      data: z.object({
        mainVault: address,
        vaultAssets: amount,
        reserveAssets: amount,
        reserveVault: address.optional(),
        totalClaims: amount,
        lossHeadroom: amount,
        lossHeadroomRatio: amount,
        senior: tranche,
        junior: tranche
      })
    })
    .nullable(),
  liquidity: observation
    .extend({
      data: z.object({
        kind: z.literal('indexed-cap'),
        depositCap: amount,
        withdrawCap: amount,
        withdrawalConstraint: z.enum(['rate-limit', 'vault-liquidity', 'both']).nullable().optional(),
        withdrawalWindowResetsAt: z.iso.datetime().nullable()
      })
    })
    .nullable(),
  allocations: observation
    .extend({
      data: z
        .object({
          rows: z.array(
            allocation.extend({
              underlying: observation
                .extend({
                  rows: z.array(allocation),
                  unresolvedAssets: z.number()
                })
                .optional()
            })
          ),
          unresolvedAssets: z.number()
        })
        .nullable()
    })
    .nullable()
})
const historySchema = envelope.extend({
  sources: z.array(observation.extend({ series: z.enum(['system', 'senior', 'junior', 'pps']) })),
  points: z.array(
    z.object({
      day: z.iso.date(),
      lossHeadroom: amount,
      lossHeadroomRatio: amount.optional(),
      seniorCoverage: amount.optional(),
      seniorApy: amount.optional(),
      juniorApy: amount.optional(),
      seniorPps: amount,
      juniorPps: amount.optional(),
      seniorTvl: amount.optional(),
      juniorTvl: amount.optional()
    })
  ),
  mockSettlement: z
    .object({
      day: z.iso.date(),
      juniorLoss: z.number().nonnegative(),
      seniorLoss: z.number().nonnegative(),
      bufferBefore: amount.optional(),
      bufferAfter: amount.optional()
    })
    .optional()
})
export type TLiveSnapshot = z.infer<typeof snapshotSchema>
export type TLiveHistory = z.infer<typeof historySchema>
export type TLiveObservation = z.infer<typeof observation>

const allocationExample = snapshotSchema.parse(fixture.snapshot)
const performanceExample = historySchema.parse({
  version: allocationExample.version,
  mode: allocationExample.mode,
  status: allocationExample.status,
  market: allocationExample.market,
  sources: [],
  points: fixture.performance.map((point) => ({ ...point, lossHeadroom: null }))
})
const previewExample = { snapshot: allocationExample, history: performanceExample }

async function read<T>(url: URL, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(18_000), redirect: 'error' })
    if (!response.ok) return null
    const result = schema.safeParse(await response.json())
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export async function getSeniorLiveData(): Promise<{ snapshot: TLiveSnapshot | null; history: TLiveHistory | null }> {
  const allowFixture = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development'
  const origin = process.env.SENIOR_LIVE_DATA_API_URL

  if (!origin) {
    if (allowFixture) {
      return previewExample
    }
    return {
      snapshot: {
        version: 1,
        mode: 'prelaunch',
        status: 'prelaunch',
        market: { chainId: 1, asset: 'USDC', controller: null },
        accounting: null,
        liquidity: null,
        allocations: null
      },
      history: null
    }
  }

  try {
    const [snapshot, history] = await Promise.all([
      read(new URL('/v1/snapshot', origin), snapshotSchema),
      read(new URL('/v1/history', origin), historySchema)
    ])
    if (!snapshot) return { snapshot: null, history: null }
    if (snapshot.mode === 'fixture') return allowFixture ? previewExample : { snapshot: null, history: null }
    const matchesMarket =
      history?.mode === snapshot.mode &&
      history.market.controller === snapshot.market.controller &&
      history.market.chainId === snapshot.market.chainId
    return { snapshot, history: matchesMarket ? history : null }
  } catch {
    return { snapshot: null, history: null }
  }
}
