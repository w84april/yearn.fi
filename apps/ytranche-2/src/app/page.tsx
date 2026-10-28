import type { Metadata } from 'next'
import { ForestLanding } from '@/components/forest/ForestLanding'

export const metadata: Metadata = {
  title: 'yTranche | Let it flow',
  description: 'A steadier stream. Explore Yearn’s Fixed USDC tranche in an interactive forest demo.'
}

export default function HomePage() {
  return <ForestLanding />
}
