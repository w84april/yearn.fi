import type { Metadata } from 'next'
import { ForestLanding } from '@/components/forest/ForestLanding'

export const metadata: Metadata = {
  title: 'yTranche | Your USDC has a job. You have a life.',
  description: 'Deposit USDC into Yearn Fixed. We handle the strategies. You handle the weekend.'
}

export default function PersonalityPage() {
  return <ForestLanding variant="personality" />
}
