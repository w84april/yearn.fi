// @vitest-environment jsdom

import SeniorLiveData from '@pages/senior/SeniorLiveData'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getSeniorLiveData, type TLiveObservation, type TLiveSnapshot } from '@/server/senior/liveData'

const observation = {
  source: 'kong',
  status: 'available',
  blockNumber: 25_000_000,
  observedAt: '2026-11-13T12:00:00Z',
  url: null
} satisfies TLiveObservation

const tranche = {
  address: null,
  claim: 8_000_000,
  covered: 8_000_000,
  coverage: 1,
  targetApr: 0.05,
  accrualPaused: false
}

const snapshot = {
  version: 1,
  mode: 'kong',
  status: 'available',
  market: { chainId: 1, asset: 'USDC', controller: null },
  juniorCapital: {
    ...observation,
    data: {
      tvl: 10_000_000,
      fixedTvl: 8_000_000,
      leveredTvl: 1_000_000,
      equityTvl: 1_000_000,
      withdrawalsInCooldown: 0
    }
  },
  accounting: {
    ...observation,
    data: {
      mainVault: null,
      vaultAssets: 10_000_000,
      reserveAssets: null,
      totalClaims: 10_000_000,
      lossHeadroom: 2_000_000,
      lossHeadroomRatio: 0.2,
      senior: tranche,
      junior: { ...tranche, claim: 2_000_000, covered: 2_000_000 }
    }
  },
  liquidity: {
    ...observation,
    data: { kind: 'indexed-cap', depositCap: 100_000, withdrawCap: 800_000, withdrawalWindowResetsAt: null }
  },
  allocations: null
} satisfies TLiveSnapshot

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

describe('Senior live data summary', () => {
  it('leads with Senior TVL and keeps total TVL with the allocation', () => {
    render(<SeniorLiveData snapshot={snapshot} history={null} />)
    const summary = screen.getByLabelText('Senior at a glance')
    const allocation = screen.getByRole('region', { name: 'Senior and Junior allocation' })

    expect(summary.compareDocumentPosition(allocation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(
      within(summary)
        .getAllByRole('term')
        .map((term) => term.textContent)
    ).toEqual(['Senior TVL', 'Protected by', 'Senior withdrawal cap'])
    const lossBuffer = within(summary).getByText('Protected by').nextElementSibling
    expect(lossBuffer?.textContent).toBe('2,000,000 USDC')
    expect(within(summary).queryByText(/of Senior TVL|Before reserve support/)).toBeNull()
    expect(within(summary).queryByRole('link', { name: 'View tranche allocation' })).toBeNull()
    expect(within(allocation).getByText('Total TVL')).toBeTruthy()
    expect(
      within(allocation).queryByText(
        /Share of TVL before cooldown deductions|Junior after cooldown deductions|15% minimum/
      )
    ).toBeNull()
  })

  it('shows the simulated withdrawal cap in USD without a live observation time', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('SENIOR_LIVE_DATA_API_URL', undefined)
    const data = await getSeniorLiveData()
    render(<SeniorLiveData {...data} />)
    const cap = screen.getByText('Senior withdrawal cap').nextElementSibling

    expect(cap?.textContent).toBe('1,128,288 USD')
    expect(screen.queryByRole('link', { name: 'Policy minimum (Rule 6)' })).toBeNull()
    expect(screen.getByText(/withdrawal cap and performance history are simulated/)).toBeTruthy()
  })

  it('switches between simulated APY, share price and TVL above vault allocations', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('SENIOR_LIVE_DATA_API_URL', undefined)
    const { snapshot, history } = await getSeniorLiveData()
    if (!history) throw new Error('Expected simulated history')
    const olderPoint = { ...history.points[0], day: '2026-10-14', lossHeadroom: null, seniorApy: 0.04 }
    render(<SeniorLiveData snapshot={snapshot} history={{ ...history, points: [olderPoint, ...history.points] }} />)

    const performance = screen.getByRole('region', { name: 'Senior performance' })
    const allocations = screen.getByRole('region', { name: 'Direct vault allocations' })
    const chart = within(performance)
    expect(performance.compareDocumentPosition(allocations) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(chart.queryByText(/Simulated history|Last 30 days/)).toBeNull()
    expect(chart.getByRole('button', { name: 'APY' }).getAttribute('aria-pressed')).toBe('true')
    const apy = chart.getByRole('img', { name: /Senior and Junior APY/ })
    expect(apy.querySelectorAll('path[d*="C"]')).toHaveLength(2)
    fireEvent.keyDown(apy, { key: 'End' })
    expect(chart.getByText('8.83%')).toBeTruthy()

    fireEvent.click(chart.getByRole('button', { name: 'Share price' }))
    const sharePrice = chart.getByRole('img', { name: /Senior and Junior Share price in USD/i })
    expect(sharePrice.querySelectorAll('path[d*="C"]')).toHaveLength(2)
    fireEvent.keyDown(sharePrice, { key: 'End' })
    expect(chart.getByText('1.006020 USD')).toBeTruthy()
    expect(chart.getByText('1.011770 USD')).toBeTruthy()

    fireEvent.click(chart.getByRole('button', { name: 'TVL' }))
    const tvl = chart.getByRole('img', { name: /Senior and Junior TVL in USD/ })
    expect(tvl.querySelectorAll('path[d*="C"]')).toHaveLength(2)
    fireEvent.keyDown(tvl, { key: 'End' })
    expect(chart.getByText('9,402,400 USD')).toBeTruthy()
    expect(chart.getByText('2,350,600 USD')).toBeTruthy()
    expect(chart.getByText('Oct 15')).toBeTruthy()
    expect(chart.queryByText('Oct 14')).toBeNull()
  })

  it.each([{ status: 'stale' }, { status: 'unverified' }, { observedAt: null }] satisfies Partial<TLiveObservation>[])(
    'hides the withdrawal cap for a liquidity observation with %j',
    (overrides) => {
      render(
        <SeniorLiveData snapshot={{ ...snapshot, liquidity: { ...snapshot.liquidity, ...overrides } }} history={null} />
      )
      expect(screen.queryByText('Senior withdrawal cap')).toBeNull()
    }
  )

  it('shows a zero withdrawal cap', () => {
    const liquidity = {
      ...snapshot.liquidity,
      data: { ...snapshot.liquidity.data, withdrawCap: 0 }
    }
    render(<SeniorLiveData snapshot={{ ...snapshot, liquidity }} history={null} />)
    const cap = screen.getByText('Senior withdrawal cap').nextElementSibling
    expect(cap?.textContent).toContain('0 USDC')
  })
})
