import SeniorLiveData from '@pages/senior/SeniorLiveData'
import type { Metadata } from 'next'
import { getSeniorLiveData } from '@/server/senior/liveData'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Senior Live Data',
  description: 'See the Senior and Junior allocation, the Junior capital minimum, and vault allocations.',
  robots: { index: false, follow: false }
}

export default async function SeniorLiveDataPage() {
  const { snapshot, history } = await getSeniorLiveData()
  return <SeniorLiveData snapshot={snapshot} history={history} />
}
