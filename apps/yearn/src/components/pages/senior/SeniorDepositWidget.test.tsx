// @vitest-environment jsdom

import SeniorDepositWidget from '@pages/senior/SeniorDepositWidget'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useErc4626Vault, VaultWidget, type VaultWidgetProps } from '@yearn/vault-widget'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/AppProviders', () => ({ AppProviders: ({ children }: { children: ReactNode }) => children }))
vi.mock('@shared/contexts/YearnVaultWidgetRuntimeProvider', () => ({
  YearnVaultWidgetRuntimeProvider: ({ children }: { children: ReactNode }) => children
}))
vi.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({ invalidateQueries: vi.fn() }) }))
vi.mock('wagmi', () => ({ useAccount: () => ({ address: '0x0000000000000000000000000000000000000001' }) }))
vi.mock('@yearn/vault-widget', () => ({
  useErc4626Vault: vi.fn(),
  VaultWidget: vi.fn(() => <button type="button">Review deposit</button>),
  WidgetActionType: { Deposit: 'deposit', Withdraw: 'withdraw' }
}))

type TSnapshot = ReturnType<typeof useErc4626Vault>

function createSnapshot(): TSnapshot {
  return {
    vault: {
      address: '0x2D4F47208853a3D20EADCbdA0F03900771C6Eba3',
      chainId: 1,
      contractKind: 'erc4626',
      decimals: 6,
      symbol: 'yvUSD-A',
      name: 'Live Senior vault',
      asset: {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
        symbol: 'USDC',
        name: 'USD Coin'
      },
      isRetired: false
    },
    vaultUserData: {
      assetToken: undefined,
      vaultToken: undefined,
      stakingToken: undefined,
      pricePerShare: 0n,
      availableToDeposit: 25_000_000n,
      depositedShares: 10_000_000n,
      depositedValue: 11_000_000n,
      stakingWithdrawableAssets: 0n,
      stakingRedeemableShares: 0n,
      erc4626: {
        maxDeposit: 25_000_000n,
        maxWithdraw: 4_000_000n,
        maxRedeem: 3_800_000n,
        redeemableAssets: 4_000_000n
      },
      isLoading: false,
      error: undefined,
      refetch: vi.fn()
    },
    isLoading: false,
    error: undefined,
    refetch: vi.fn().mockResolvedValue(undefined)
  }
}

function renderedWidgetProps(): VaultWidgetProps {
  const props = vi.mocked(VaultWidget).mock.lastCall?.[0]
  if (!props) throw new Error('The live vault widget was not rendered')
  return props
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(cleanup)

describe('Senior vault integration', () => {
  it('preserves live limits and preview amounts with a zero-loss exit policy without inventing APR', () => {
    const snapshot = createSnapshot()
    vi.mocked(useErc4626Vault).mockReturnValue(snapshot)
    const { rerender } = render(<SeniorDepositWidget />)
    const props = renderedWidgetProps()

    expect(props.vaultUserData).toBe(snapshot.vaultUserData)
    expect(props.vaultUserData.erc4626).toBe(snapshot.vaultUserData?.erc4626)
    expect(props.currentVault).toMatchObject({ contractKind: 'erc4626', withdrawMaxLossBps: 0n })
    expect(props.currentVault.forwardAPR).toBeUndefined()
    expect(props.withdrawalSource).toBe('vault')

    const limited = createSnapshot()
    if (!limited.vaultUserData?.erc4626) throw new Error('The contract snapshot lacks withdrawal limits')
    limited.vaultUserData.erc4626 = { maxDeposit: 0n, maxWithdraw: 0n, maxRedeem: 0n, redeemableAssets: 0n }
    vi.mocked(useErc4626Vault).mockReturnValue(limited)
    rerender(<SeniorDepositWidget />)
    expect(renderedWidgetProps().vaultUserData).toBe(limited.vaultUserData)
    expect(renderedWidgetProps().vaultUserData.erc4626?.maxWithdraw).toBe(0n)
  })

  it.each([true, false])('withholds actions when no live snapshot is available (loading: %s)', (isLoading) => {
    vi.mocked(useErc4626Vault).mockReturnValue({
      ...createSnapshot(),
      vault: undefined,
      vaultUserData: undefined,
      isLoading
    })
    render(<SeniorDepositWidget />)
    expect(screen.getByRole('status').textContent).toContain(
      isLoading ? 'Reading current vault limits' : 'Unable to load the Senior vault'
    )
    expect(VaultWidget).not.toHaveBeenCalled()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('blocks an old snapshot after a failed refresh and lets the user retry safely', async () => {
    const snapshot = createSnapshot()
    const refetch = vi.fn().mockRejectedValue(new Error('Network unavailable'))
    vi.mocked(useErc4626Vault).mockReturnValue({ ...snapshot, error: 'Unable to read current vault limits.', refetch })
    render(<SeniorDepositWidget />)

    expect(screen.getByRole('alert').textContent).toContain('Unable to read current vault limits.')
    expect(VaultWidget).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(refetch).toHaveBeenCalledOnce())
    expect(screen.queryByRole('button', { name: 'Review deposit' })).toBeNull()
  })
})
