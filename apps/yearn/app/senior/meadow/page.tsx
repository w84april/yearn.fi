import SeniorLanding from '@pages/senior/SeniorLanding'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senior — Let it rest',
  description: 'USDC yield from Yearn vaults. Explore how Senior works and go deeper into the onchain details.',
  robots: { index: false, follow: false }
}

export default function SeniorMeadowPage() {
  return <SeniorLanding edition="paper" />
}
