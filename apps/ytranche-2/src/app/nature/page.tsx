import type { Metadata } from 'next'
import { ForestLanding } from '@/components/forest/ForestLanding'

export const metadata: Metadata = {
  title: 'yTranche | Let your USDC earn. Let yourself wander.',
  description: 'Put USDC to work with Yearn Fixed. The world has more to offer than another refresh.'
}

export default function NaturePage() {
  return <ForestLanding variant="nature" />
}
