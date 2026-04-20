import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// PATCH: 후기 수정 (본인만)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers as unknown as Headers })
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const body = await request.json()
    const { rating, content, siteUrl } = body

    const updated = await payload.update({
      collection: 'reviews',
      id: Number(id),
      data: {
        rating: Number(rating),
        content: content.trim(),
        siteUrl: siteUrl?.trim() || undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('[REVIEWS PATCH]', (e as Error).message)
    return NextResponse.json({ error: '후기 수정에 실패했습니다.' }, { status: 500 })
  }
}
