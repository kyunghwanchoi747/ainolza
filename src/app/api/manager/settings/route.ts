import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'

const DEFAULT_NAVIGATION = [
  { label: '홈', path: '/home', type: 'home', enabled: true, order: 0 },
  { label: '스토어', path: '/store', type: 'store', enabled: true, order: 1 },
  { label: '커뮤니티', path: '/community', type: 'community', enabled: true, order: 2 },
  { label: '프로그램', path: '/programs', type: 'programs', enabled: true, order: 3 },
]

async function getOrCreateSettings() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'site-settings' as any,
    limit: 1,
  })

  if (result.docs.length > 0) {
    return result.docs[0]
  }

  // Create default settings
  const created = await payload.create({
    collection: 'site-settings' as any,
    data: {
      siteName: 'AI 놀자',
      homePath: '/home',
      navigation: DEFAULT_NAVIGATION,
    },
  })
  return created
}

export async function GET() {
  try {
    const settings = await getOrCreateSettings()
    return NextResponse.json(settings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError
  try {
    const payload = await getPayloadClient()
    const body: any = await req.json()

    const settings = await getOrCreateSettings()

    const updateData: Record<string, any> = {}
    if (body.siteName !== undefined) updateData.siteName = body.siteName
    if (body.homePath !== undefined) updateData.homePath = body.homePath
    if (body.navigation !== undefined) updateData.navigation = body.navigation

    const updated = await payload.update({
      collection: 'site-settings' as any,
      id: settings.id,
      data: updateData,
    })
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
