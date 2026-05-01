import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// GET: 승인된 후기 목록 (홈 배너용)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const payload = await getPayloadClient()

    const userId = searchParams.get('where[user][equals]')
    const statusFilter = searchParams.get('where[status][equals]')

    const where: any = {}
    if (userId) where.user = { equals: Number(userId) }
    if (statusFilter) where.status = { equals: statusFilter }
    if (!userId && !statusFilter) where.status = { equals: 'approved' }

    const result = await payload.find({
      collection: 'reviews',
      where,
      sort: 'order',
      limit: Number(searchParams.get('limit') || 50),
      depth: 1,
    })

    return NextResponse.json(result)
  } catch (e) {
    console.error('[REVIEWS GET]', (e as Error).message)
    return NextResponse.json({ error: '후기를 불러오지 못했습니다.' }, { status: 500 })
  }
}

// POST: 후기 작성 (로그인 필요)
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers as unknown as Headers })
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const body = await request.json() as {
      rating: number
      content: string
      siteUrl?: string
      displayName?: string
      order?: number
    }

    const { rating, content, siteUrl, displayName, order } = body
    if (!rating || !content?.trim()) {
      return NextResponse.json({ error: '별점과 내용을 입력해주세요.' }, { status: 400 })
    }

    const isAdmin = (user as { role?: string }).role === 'admin'
    const trimmedDisplayName = displayName?.trim()

    // admin이고 displayName을 보낸 경우 → 임의 작성 모드 (user 연결 없음)
    const isAdminCustom = isAdmin && !!trimmedDisplayName

    const data: Record<string, unknown> = {
      rating: Number(rating),
      content: content.trim(),
      siteUrl: siteUrl?.trim() || undefined,
      status: 'approved',
      order: typeof order === 'number' ? order : 0,
    }

    if (isAdminCustom) {
      data.displayName = trimmedDisplayName
      // user는 비워둠
    } else {
      data.user = (user as { id: number | string }).id
      if (trimmedDisplayName) data.displayName = trimmedDisplayName
    }

    const review = await payload.create({
      collection: 'reviews',
      data: data as any,
      overrideAccess: isAdminCustom, // admin 임의 작성 시 user required 검증 우회
    })

    return NextResponse.json(review, { status: 201 })
  } catch (e) {
    console.error('[REVIEWS POST]', (e as Error).message)
    return NextResponse.json({ error: '후기 저장에 실패했습니다.' }, { status: 500 })
  }
}
