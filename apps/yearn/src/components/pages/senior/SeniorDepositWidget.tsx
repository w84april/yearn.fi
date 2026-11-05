'use client'

import styles from '@pages/senior/SeniorDepositWidget.module.css'
import { useQueryClient } from '@tanstack/react-query'
import { useErc4626Vault, VaultWidget, WidgetActionType } from '@yearn/vault-widget'
import { useAccount } from 'wagmi'

const SENIOR_VAULT_ADDRESS = '0x2D4F47208853a3D20EADCbdA0F03900771C6Eba3'
const actions = [WidgetActionType.Deposit, WidgetActionType.Withdraw]

export default function SeniorDepositWidget() {
  const { address } = useAccount()
  const queryClient = useQueryClient()
  const { vault, vaultUserData, isLoading, error, refetch } = useErc4626Vault({
    address: SENIOR_VAULT_ADDRESS,
    chainId: 1,
    account: address
  })

  return (
    <section className={`yv-widget ${styles.widget}`} aria-label="Manage your USDC position">
      {error ? (
        <p role="alert">
          {error}{' '}
          <button type="button" className={styles.retry} onClick={() => void refetch().catch(() => undefined)}>
            Retry
          </button>
        </p>
      ) : vault && vaultUserData ? (
        <VaultWidget
          appearance="calm"
          // Keep live limits and previews alongside the original Senior withdrawal policy.
          currentVault={{ ...vault, withdrawMaxLossBps: 0n }}
          actions={actions}
          chainId={1}
          vaultUserData={vaultUserData}
          handleSuccess={() => {
            void queryClient.invalidateQueries()
          }}
          depositTitleOverride=""
          withdrawTitleOverride=""
          withdrawalSource="vault"
          disableDepositStaking
          disableTokenSelector
        />
      ) : (
        <p role="status">{isLoading ? 'Reading current vault limits…' : 'Unable to load the Senior vault.'}</p>
      )}
    </section>
  )
}
