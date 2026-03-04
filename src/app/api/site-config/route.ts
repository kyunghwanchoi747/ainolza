import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const DEFAULT_NAVIGATION = [
  { label: '홈', path: '/home', type: 'home', enabled: true, order: 0 },
  { label: '스토어', path: '/store', type: 'store', enabled: true, order: 1 },
  { label: '커뮤니티', path: '/community', type: 'community', enabled: true, order: 2 },
  { label: '프로그램', path: '/programs', type: 'programs', enabled: true, order: 3 },
]

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'site-settings' as any,
      limit: 1,
    })

    const settings = result.docs[0]
    const navigation = settings?.navigation || DEFAULT_NAVIGATION
    const homePath = settings?.homePath || '/home'

    return NextResponse.json(
      { navigation, homePath },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    )
  } catch {
    // If DB not ready, return defaults
    return NextResponse.json(
      { navigation: DEFAULT_NAVIGATION, homePath: '/home' },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=10',
        },
      },
    )
  }
}
