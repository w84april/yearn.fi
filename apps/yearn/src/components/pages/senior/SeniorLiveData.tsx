import { PerformanceHistory, ProtectionHistory } from '@pages/senior/SeniorHistory'
import styles from '@pages/senior/SeniorLiveData.module.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { TLiveHistory, TLiveObservation, TLiveSnapshot } from '@/server/senior/liveData'

const usd = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })
const percentage = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 })
const dateTime = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })
const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
const DAY_MS = 86_400_000
const JUNIOR_MINIMUM = 0.15
const GUIDELINES = 'https://github.com/johnnyonline/ytranche-allocations/blob/ab2cafcf6f9ce3607cece001e0a199fab447a7da'

const percent = (value: number | null | undefined) => (value == null ? '—' : percentage.format(value))
const usdc = (value: number | null | undefined) => (value == null ? '—' : usd.format(value))
const timestamp = (value: string | null | undefined) => {
  const time = value ? Date.parse(value) : Number.NaN
  return Number.isFinite(time) ? dateTime.format(time) + ' UTC' : null
}
const explorer = (address: string) => 'https://etherscan.io/address/' + address

function TrancheAllocation({ observation }: { observation: TLiveSnapshot['juniorCapital'] }) {
  const { tvl, fixedTvl: seniorTvl, leveredTvl, equityTvl, withdrawalsInCooldown } = observation?.data ?? {}
  const juniorTvl = leveredTvl != null && equityTvl != null ? leveredTvl + equityTvl : null
  const unit = observation?.source === 'fixture' ? ' USD' : ' USDC'
  const amount = (value: number | null | undefined) => (value == null ? '—' : usdc(value) + unit)
  const shareOfTvl = (value: number | null | undefined) =>
    tvl != null && tvl > 0 && value != null && value <= tvl ? value / tvl : null
  const juniorShare = shareOfTvl(juniorTvl)
  const seniorShare = shareOfTvl(seniorTvl)
  const juniorRatio =
    observation?.status === 'available' &&
    tvl != null &&
    tvl > 0 &&
    juniorTvl != null &&
    withdrawalsInCooldown != null &&
    withdrawalsInCooldown <= juniorTvl &&
    juniorTvl <= tvl
      ? (juniorTvl - withdrawalsInCooldown) / tvl
      : null
  const belowMinimum = juniorRatio != null && juniorRatio < JUNIOR_MINIMUM

  return (
    <section className={styles.trancheAllocation} aria-labelledby="tranche-allocation">
      <div className={styles.sectionTitle}>
        <h2 id="tranche-allocation">Senior and Junior allocation</h2>
        {observation && observation.source !== 'fixture' && <Source observation={observation} />}
      </div>
      {observation && (
        <>
          <dl className={styles.trancheAmounts}>
            <div>
              <dt>
                <span className={styles.juniorCapital} aria-hidden="true" />
                Junior
              </dt>
              <dd className={styles.trancheShare}>{percent(juniorShare)}</dd>
              <dd className={styles.source}>{amount(juniorTvl)}</dd>
            </div>
            <div>
              <dt>
                <span className={styles.seniorCapital} aria-hidden="true" />
                Senior
              </dt>
              <dd className={styles.trancheShare}>{percent(seniorShare)}</dd>
              <dd className={styles.source}>{amount(seniorTvl)}</dd>
            </div>
          </dl>
          {juniorShare != null && seniorShare != null && juniorShare + seniorShare <= 1 + Number.EPSILON && (
            <div className={styles.capitalSplit} aria-hidden="true">
              <span className={styles.juniorCapital} style={{ width: `${juniorShare * 100}%` }} />
              <span className={styles.seniorCapital} style={{ width: `${seniorShare * 100}%` }} />
            </div>
          )}
          <p className={styles.source}>
            Total TVL <strong>{amount(tvl)}</strong>
          </p>
        </>
      )}
      {belowMinimum && (
        <p className={styles.notice}>
          <strong>Junior capital below the {percent(JUNIOR_MINIMUM)} minimum.</strong> Rule 8 calls for pausing Senior
          deposits until the breach is fixed. <a href={GUIDELINES + '/GUIDELINES.md#L94-L99'}>Allocation guidelines</a>
        </p>
      )}
    </section>
  )
}

function Source({
  observation,
  valueAvailable = true,
  compact = false
}: {
  observation: TLiveObservation | null
  valueAvailable?: boolean
  compact?: boolean
}) {
  const observed = timestamp(observation?.observedAt)
  const status =
    !valueAvailable || !observation || observation.status === 'unavailable'
      ? 'Unavailable'
      : observation.status === 'stale'
        ? 'Stale data'
        : observation.status === 'unverified'
          ? 'Unverified data'
          : null
  return (
    <span className={styles.source}>
      {status && <strong>{status} · </strong>}
      {observed ? (
        <>
          As of <time dateTime={observation?.observedAt ?? undefined}>{observed}</time>
        </>
      ) : (
        'Observation time unavailable'
      )}
      {observation?.blockNumber != null && (
        <>
          {' '}
          · <a href={'https://etherscan.io/block/' + observation.blockNumber}>Block {observation.blockNumber}</a>
        </>
      )}
      {!compact && observation?.url?.startsWith('https://kong.yearn.fi/') && (
        <>
          {' '}
          · <a href={observation.url}>Kong source</a>
        </>
      )}
    </span>
  )
}

function Metric({
  label,
  value,
  observation,
  detail
}: {
  label: string
  value: ReactNode
  observation: TLiveObservation | null | undefined
  detail?: { href: string; label: string }
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd data-unavailable={value == null || undefined}>{value ?? 'Unavailable'}</dd>
      {observation && observation.source !== 'fixture' && (
        <dd className={styles.metricSource}>
          <Source observation={observation} valueAvailable={value != null} compact />
        </dd>
      )}
      {detail && (
        <dd className={styles.metricLink}>
          <a href={detail.href}>{detail.label}</a>
        </dd>
      )}
    </div>
  )
}

const withdrawalConstraints = {
  'rate-limit': 'Senior tranche withdrawal rate limit',
  'vault-liquidity': 'Available vault liquidity',
  both: 'Senior tranche rate limit and available vault liquidity'
} as const

function trailingReturn(points: TLiveHistory['points'], days: number) {
  const last = points.at(-1)
  if (!last?.seniorPps) return null
  const start = new Date(Date.parse(last.day) - days * DAY_MS).toISOString().slice(0, 10)
  const initial = points.find((point) => point.day === start)?.seniorPps
  return initial ? last.seniorPps / initial - 1 : null
}

export default function SeniorLiveData({
  snapshot,
  history
}: {
  snapshot: TLiveSnapshot | null
  history: TLiveHistory | null
}) {
  const fixture = snapshot?.mode === 'fixture'
  const unit = fixture ? ' USD' : ' USDC'
  const capital = snapshot?.juniorCapital
  const seniorTvl = capital?.data.fixedTvl
  const accounting = snapshot?.accounting?.data
  const lossHeadroom = accounting?.lossHeadroom
  const lossBufferShare = accounting?.lossHeadroomRatio
  const shortfall = (lossHeadroom ?? lossBufferShare ?? 0) < 0
  const liquidityObservation = snapshot?.liquidity
  const liquidity = liquidityObservation?.data
  const allocations = snapshot?.allocations?.data
  const points = history?.points ?? []
  const seniorClaim = accounting?.senior.claim
  const seniorCovered = accounting?.senior.covered
  const reserve = accounting?.reserveAssets
  const vaultAssets = accounting?.vaultAssets
  const indexedWithdrawCap = liquidity?.withdrawCap
  const withdrawCap =
    liquidityObservation?.status === 'available' &&
    (fixture
      ? liquidityObservation.source === 'fixture'
      : liquidityObservation.source === 'kong' && liquidityObservation.observedAt != null) &&
    indexedWithdrawCap != null &&
    indexedWithdrawCap >= 0
      ? indexedWithdrawCap
      : null
  const withdrawalConstraint = liquidity?.withdrawalConstraint
  const coverageShare = accounting?.senior.coverage
  const reset = timestamp(liquidity?.withdrawalWindowResetsAt)
  const headroomSources =
    history?.sources.filter((source) => source.series === 'system' || source.series === 'senior') ?? []
  const performanceSources = history?.sources.filter((source) => source.series !== 'system') ?? []

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/senior" aria-label="Yearn Senior">
          <span className={styles.wordmark} aria-hidden="true" />
          <span>Senior</span>
        </Link>
        <Link href="/senior">Back to Senior</Link>
      </header>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Senior live data</h1>
          <p>{fixture ? 'yvUSD allocation example' : 'USDC on Ethereum'}</p>
        </div>
        {fixture && (
          <p className={styles.notice} role="status">
            <strong>Illustrative data</strong> ·{' '}
            <a href={GUIDELINES + '/config/vaults/yvusd.yaml'}>Hypothetical yvUSD allocation</a> from the guidelines.
            Loss buffer, withdrawal cap and performance history are simulated.
          </p>
        )}
        {(!snapshot || snapshot.status === 'prelaunch') && (
          <p className={styles.notice} role="status">
            {snapshot
              ? 'Awaiting deployment. The planned Senior annual target is 5%.'
              : 'Senior data is temporarily unavailable.'}
          </p>
        )}
        {snapshot?.status === 'partial' && (
          <p className={styles.notice} role="status">
            Some observations are stale or unavailable. Check the source time in each section.
          </p>
        )}
        {accounting?.senior.accrualPaused && (
          <p className={styles.notice} role="status">
            Senior tranche target accrual is paused.
          </p>
        )}
        {snapshot && snapshot.status !== 'prelaunch' && (
          <dl className={styles.metrics} aria-label="Senior at a glance">
            <Metric
              label="Senior TVL"
              value={
                seniorTvl == null ? null : (
                  <>
                    {usdc(seniorTvl)}
                    <span className={styles.unit}>{unit}</span>
                  </>
                )
              }
              observation={capital}
            />
            <Metric
              label={shortfall ? 'Senior backing shortfall' : 'Protected by'}
              value={
                lossHeadroom == null ? null : (
                  <>
                    {usdc(Math.abs(lossHeadroom))}
                    <span className={styles.unit}>{unit}</span>
                  </>
                )
              }
              observation={snapshot.accounting}
              detail={fixture ? undefined : { href: '#protection-history', label: 'View protection history' }}
            />
            {withdrawCap != null && (
              <Metric
                label="Senior withdrawal cap"
                value={
                  <>
                    {usdc(withdrawCap)}
                    <span className={styles.unit}>{unit}</span>
                  </>
                }
                observation={liquidityObservation}
                detail={fixture ? undefined : { href: '#senior-withdrawals', label: 'View withdrawal limits' }}
              />
            )}
          </dl>
        )}
        <TrancheAllocation observation={capital} />
        {snapshot && snapshot.status !== 'prelaunch' && (
          <>
            {!fixture && (
              <section className={styles.section} aria-labelledby="fixed-backing">
                <div className={styles.sectionTitle}>
                  <h2 id="fixed-backing">Senior tranche backing</h2>
                </div>
                <dl className={styles.rows}>
                  <div>
                    <dt>Senior claim coverage</dt>
                    <dd>
                      {percent(coverageShare)}
                      {seniorClaim != null && seniorCovered != null && (
                        <span className={styles.source}>
                          {' · ' +
                            compact.format(seniorCovered) +
                            ' of ' +
                            compact.format(seniorClaim) +
                            ' USDC covered'}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Vault assets backing the tranches</dt>
                    <dd>{vaultAssets == null ? 'Unavailable' : usdc(vaultAssets) + ' USDC'}</dd>
                  </div>
                  <div>
                    <dt>Reserve</dt>
                    <dd>
                      {accounting?.reserveVault === null
                        ? 'No reserve configured'
                        : reserve == null || (reserve === 0 && !accounting?.reserveVault)
                          ? 'Reserve status unavailable'
                          : reserve === 0
                            ? 'Reserve unfunded'
                            : usdc(reserve) + ' USDC'}
                    </dd>
                  </div>
                </dl>
                <ProtectionHistory points={points} />
                {headroomSources.length > 0 && (
                  <details
                    className={styles.details}
                    open={headroomSources.some((source) => source.status !== 'available') || undefined}
                  >
                    <summary>Protection history sources</summary>
                    {headroomSources.map((source) => (
                      <p key={source.series}>
                        <Source observation={source} />
                      </p>
                    ))}
                  </details>
                )}
              </section>
            )}
            {!fixture && (
              <section className={styles.section} aria-labelledby="senior-withdrawals">
                <div className={styles.sectionTitle}>
                  <h2 id="senior-withdrawals">Deposits and withdrawals</h2>
                  <Source observation={snapshot.liquidity} />
                </div>
                <dl className={styles.rows}>
                  <div>
                    <dt>Constraint at observation</dt>
                    <dd>{withdrawalConstraint ? withdrawalConstraints[withdrawalConstraint] : 'Unavailable'}</dd>
                  </div>
                  <div>
                    <dt>Senior tranche deposit cap</dt>
                    <dd>{liquidity?.depositCap == null ? 'Unavailable' : usdc(liquidity.depositCap) + ' USDC'}</dd>
                  </div>
                  {reset && (withdrawalConstraint === 'rate-limit' || withdrawalConstraint === 'both') && (
                    <div>
                      <dt>Withdrawal limit window resets</dt>
                      <dd>{reset}</dd>
                    </div>
                  )}
                </dl>
                <p className={styles.source}>A fresh, amount-specific withdrawal quote is unavailable.</p>
              </section>
            )}
            <section className={styles.section} aria-labelledby="senior-performance">
              <PerformanceHistory points={points} illustrative={fixture} />
              {!fixture && performanceSources.length > 0 && (
                <details
                  className={styles.details}
                  open={performanceSources.some((source) => source.status !== 'available') || undefined}
                >
                  <summary>Performance history sources</summary>
                  {performanceSources.map((source) => (
                    <p key={source.series}>
                      <Source observation={source} />
                    </p>
                  ))}
                </details>
              )}
            </section>
            <section className={styles.section} aria-labelledby="senior-allocations">
              <div className={styles.sectionTitle}>
                <h2 id="senior-allocations">Direct vault allocations</h2>
                {!fixture && <Source observation={snapshot.allocations} />}
              </div>
              {allocations ? (
                <div className={styles.tableWrap}>
                  <table className={styles.table} aria-label="Direct backing vault allocations">
                    <thead>
                      <tr>
                        <th scope="col">Strategy</th>
                        <th scope="col">{fixture ? 'USD' : 'USDC'}</th>
                        <th scope="col">{fixture ? 'Share of TVL' : 'Share of backing vault'}</th>
                        {!fixture && <th scope="col">Last report</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {allocations.rows.map((row) => (
                        <tr key={row.address ?? row.name}>
                          <th scope="row">
                            {row.underlying ? (
                              <details className={styles.allocationDetails}>
                                <summary>{row.name}</summary>
                                <dl aria-label={'Underlying allocations for ' + row.name}>
                                  {row.underlying.rows.map((child) => (
                                    <div key={child.address ?? child.name}>
                                      <dt>
                                        {child.address ? (
                                          <a href={explorer(child.address)}>{child.name}</a>
                                        ) : (
                                          child.name
                                        )}
                                      </dt>
                                      <dd>{percent(child.share)}</dd>
                                    </div>
                                  ))}
                                  {row.underlying.unresolvedAssets > 0 && (
                                    <div>
                                      <dt>Unresolved allocation</dt>
                                      <dd>{usdc(row.underlying.unresolvedAssets)} USDC</dd>
                                    </div>
                                  )}
                                </dl>
                                <p className={styles.source}>Percentages are shares of the underlying vault.</p>
                                {row.underlying.source !== 'fixture' && <Source observation={row.underlying} />}
                                {row.address && <a href={explorer(row.address)}>Strategy contract</a>}
                              </details>
                            ) : row.address ? (
                              <a href={explorer(row.address)}>{row.name}</a>
                            ) : (
                              row.name
                            )}
                          </th>
                          <td>{usdc(row.amount)}</td>
                          <td>{percent(row.share)}</td>
                          {!fixture && (
                            <td>
                              {row.lastReportAt ? monthDay.format(new Date(row.lastReportAt)) : 'Report unavailable'}
                            </td>
                          )}
                        </tr>
                      ))}
                      {allocations.unresolvedAssets > 0 && (
                        <tr>
                          <th scope="row">Unresolved allocation</th>
                          <td>{usdc(allocations.unresolvedAssets)}</td>
                          <td>—</td>
                          {!fixture && <td>—</td>}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={styles.empty}>Allocation data is unavailable.</p>
              )}
            </section>
            {!fixture && (
              <section className={styles.section} aria-labelledby="senior-returns">
                <div className={styles.sectionTitle}>
                  <h2 id="senior-returns">Returns</h2>
                  <Source observation={history?.sources.find((source) => source.series === 'pps') ?? null} />
                </div>
                <dl className={styles.rows}>
                  <div>
                    <dt>Senior tranche target APR</dt>
                    <dd>{percent(accounting?.senior.targetApr)}</dd>
                  </div>
                  <div>
                    <dt>7-day Senior tranche share-price return</dt>
                    <dd>{percent(trailingReturn(points, 7))}</dd>
                  </div>
                  <div>
                    <dt>30-day Senior tranche share-price return</dt>
                    <dd>{percent(trailingReturn(points, 30))}</dd>
                  </div>
                </dl>
              </section>
            )}
          </>
        )}
        <footer className={styles.footer}>
          {snapshot?.market.controller && <a href={explorer(snapshot.market.controller)}>Controller</a>}
          {accounting?.mainVault && <a href={explorer(accounting.mainVault)}>Backing vault</a>}
          <a href="https://www.chainsecurity.com/security-audit/yearn-ytranche">Audit</a>
          <a href="https://gov.yearn.fi/t/yip-91-ytranche/14659">YIP-91</a>
          <a href="https://github.com/yearn/kong/blob/main/docs/ytranche.md">Kong methodology</a>
        </footer>
      </main>
    </div>
  )
}
