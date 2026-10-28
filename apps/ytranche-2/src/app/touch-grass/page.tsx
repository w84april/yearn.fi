import type { Metadata } from 'next'
import { ForestLanding } from '@/components/forest/ForestLanding'

export const metadata: Metadata = {
  title: 'yTranche | Earn yield. Touch grass.',
  description: 'Put USDC to work with Yearn Fixed. A target APY, less rate-watching, and more time for life.'
}

export default function TouchGrassPage() {
  return <ForestLanding variant="touch-grass" />
}
