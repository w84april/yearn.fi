'use client'

import { SiteHeader } from '@yearn/site-header'
import { ThemeSettings } from '@yearn/site-header/account'
import { IconBurgerPlain } from '@yearn/site-header/icons/IconBurgerPlain'
import { IconWallet } from '@yearn/site-header/icons/IconWallet'
import { MobileNavMenu } from '@yearn/site-header/mobile'
import { formatWalletAddress, useWalletDrawer, WalletSurface } from '@yearn/wallet-ui'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { WalletAccountDropdown } from '@/components/ytranche/WalletAccountMenu'

const SITE_BASE_URL = 'https://yearn.fi'
export function EarnHeader({ productName }: { productName?: string }) {
  const { address } = useAccount()
  return <EarnHeaderContent key={address ?? 'disconnected'} productName={productName} />
}

function EarnHeaderContent({ productName }: { productName?: string }) {
  const { address, isConnected } = useAccount()
  const { openWalletDrawer, dialogId, isOpen: isWalletPickerOpen } = useWalletDrawer()
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <SiteHeader
      isHomePage
      siteBaseUrl={SITE_BASE_URL}
      brandSuffix={
        productName ? (
          <a className="ytranche-header-product" href="#still-top">
            {productName}
          </a>
        ) : undefined
      }
      actions={
        <>
          <button
            type="button"
            data-wallet-entry="header"
            data-wallet-drawer-trigger={!isConnected || undefined}
            data-wallet-account-trigger={isConnected || undefined}
            aria-label={
              isConnected && address ? `Open wallet account ${formatWalletAddress(address)}` : 'Connect wallet'
            }
            aria-controls={isConnected ? 'ytranche-wallet-account' : dialogId}
            aria-expanded={isConnected ? isAccountOpen : isWalletPickerOpen}
            aria-haspopup="dialog"
            className="ytranche-header-wallet"
            onClick={() => {
              if (isConnected) setIsAccountOpen((open) => !open)
              else openWalletDrawer()
            }}
          >
            <IconWallet className="size-4" />
            <span className="hidden sm:inline">
              {isConnected && address ? formatWalletAddress(address) : 'Connect wallet'}
            </span>
          </button>
          <button
            type="button"
            data-mobile-nav-trigger
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <IconBurgerPlain className="size-6" />
          </button>
        </>
      }
    >
      <WalletAccountDropdown address={address} isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
      <MobileNavMenu
        isDarkTheme={false}
        isOpen={isMenuOpen && !isAccountOpen && !isWalletPickerOpen && !isSettingsOpen}
        onClose={() => setIsMenuOpen(false)}
        siteBaseUrl={SITE_BASE_URL}
        walletIdentity={address ? formatWalletAddress(address) : undefined}
        onWalletClick={() => {
          setIsMenuOpen(false)
          if (isConnected) setIsAccountOpen(true)
          else openWalletDrawer()
        }}
        onSettingsClick={() => {
          setIsMenuOpen(false)
          setIsSettingsOpen(true)
        }}
      />
      <WalletSurface
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        themeClassName="ytranche-wallet-ui"
        dialogId="ytranche-settings"
        title="Settings"
        desktopTop="calc(var(--header-height) + 0.5rem)"
        desktopRight="max(1rem, calc((100vw - 1232px) / 2 + 1rem))"
      >
        <ThemeSettings />
      </WalletSurface>
    </SiteHeader>
  )
}
