import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// PATCH: 후기 수정 (본인만)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers as unknown as Headers })
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const body = await request.json() as { rating?: number; content?: string; siteUrl?: string; order?: number }

    const data: any = {}
    if (body.rating !== undefined) data.rating = Number(body.rating)
    if (body.content !== undefined) data.content = body.content.trim()
    if (body.siteUrl !== undefined) data.siteUrl = body.siteUrl?.trim() || undefined
    if (body.order !== undefined) data.order = Number(body.order)

    const updated = await payload.update({
      collection: 'reviews',
      id: Number(id),
      data,
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('[REVIEWS PATCH]', (e as Error).message)
    return NextResponse.json({ error: '후기 수정에 실패했습니다.' }, { status: 500 })
  }
}

// DELETE: 후기 삭제 (admin만)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers as unknown as Headers })
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    await payload.delete({ collection: 'reviews', id: Number(id) })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[REVIEWS DELETE]', (e as Error).message)
    return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 })
  }
}
