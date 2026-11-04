import SeniorLanding from '@pages/senior/SeniorLanding'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senior — Let it rest',
  description:
    'USDC yield from Yearn vaults. Understand Senior priority, the junior capital buffer and the onchain details.',
  robots: { index: false, follow: false }
}

export default function SeniorPage() {
  return <SeniorLanding edition="blue" />
}
