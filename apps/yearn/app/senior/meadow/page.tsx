import SeniorLanding from '@pages/senior/SeniorLanding'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senior — Let it rest',
  description:
    'Put USDC to work with a 5% annual target and Senior priority. Explore how it works, supporting capital and live onchain data.',
  robots: { index: false, follow: false }
}

export default function SeniorMeadowPage() {
  return <SeniorLanding edition="paper" />
}
