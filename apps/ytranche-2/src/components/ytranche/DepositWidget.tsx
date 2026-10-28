'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useVaultUserData, VaultWidget, type VaultWidgetVault, WidgetActionType } from '@yearn/vault-widget'
import type { ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { CONTRACTS, TOKEN_DECIMALS, WITHDRAW_MAX_LOSS_BPS } from '@/lib/ethereum'

const vault: VaultWidgetVault = {
  address: CONTRACTS.fixed,
  chainId: 1,
  version: '3.0.4',
  decimals: TOKEN_DECIMALS,
  symbol: 'yvUSD-A',
  name: 'yTranche USD Fixed',
  asset: { address: CONTRACTS.usdc, decimals: TOKEN_DECIMALS, symbol: 'USDC', name: 'USD Coin' },
  // Omit return estimates until realized APR is available.
  withdrawMaxLossBps: WITHDRAW_MAX_LOSS_BPS,
  isRetired: false
}
const actions = [WidgetActionType.Deposit, WidgetActionType.Withdraw]

export function DepositWidget() {
  const { address } = useAccount()
  const queryClient = useQueryClient()
  const vaultUserData = useVaultUserData({
    vaultAddress: CONTRACTS.fixed,
    assetAddress: CONTRACTS.usdc,
    chainId: 1,
    account: address
  })
  return (
    <DepositWidgetFrame>
      <VaultWidget
        appearance="calm"
        currentVault={vault}
        actions={actions}
        chainId={1}
        vaultUserData={vaultUserData}
        handleSuccess={() => {
          void queryClient.invalidateQueries()
        }}
        depositTitleOverride=""
        annualReturnNote="A 10% performance fee applies to earned yield."
        withdrawTitleOverride=""
        disableDepositStaking
        disableTokenSelector
      />
    </DepositWidgetFrame>
  )
}

export function DepositWidgetFrame({ children }: { children: ReactNode }) {
  return (
    <section className="yv-widget ytranche-widget" id="earn" aria-label="Manage your USDC position">
      <div className="ytranche-widget__heading">
        <p>yTranche</p>
        <h2>
          USDC <span aria-hidden="true">·</span> Fixed
        </h2>
        <span className="ytranche-widget__network">Ethereum</span>
      </div>
      {children}
    </section>
  )
}
