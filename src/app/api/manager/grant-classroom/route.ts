import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'
import { CLASSROOMS } from '@/lib/classrooms'

/**
 * 관리자 전용 — 특정 회원에게 강의실 액세스 권한을 부여한다.
 * 내부적으로는 status='paid', amount=0, productName='[테스트] ...' 인
 * Order 1건을 생성한다.
 */
export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const body = (await request.json()) as { userId?: number; email?: string; classroomSlug?: string }
    const { userId, email, classroomSlug } = body

    if (!classroomSlug) {
      return NextResponse.json({ error: 'classroomSlug 필수' }, { status: 400 })
    }
    if (!CLASSROOMS.find((c) => c.slug === classroomSlug)) {
      return NextResponse.json({ error: '존재하지 않는 강의실' }, { status: 400 })
    }
    if (!userId && !email) {
      return NextResponse.json({ error: 'userId 또는 email 필요' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // 회원 찾기
    let user: any = null
    if (userId) {
      try {
        user = await payload.findByID({ collection: 'users', id: userId })
      } catch {
        // 못 찾음
      }
    }
    if (!user && email) {
      const result = await payload.find({
        collection: 'users',
        where: { email: { equals: email.trim().toLowerCase() } },
        limit: 1,
      })
      user = result.docs[0]
    }
    if (!user) {
      return NextResponse.json({ error: '회원을 찾을 수 없습니다' }, { status: 404 })
    }

    // 이미 권한이 있는지 체크 (중복 부여 방지)
    const existing = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { user: { equals: user.id } },
          { status: { equals: 'paid' } },
          { classrooms: { in: [classroomSlug] } },
        ],
      },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      return NextResponse.json({
        ok: true,
        already: true,
        message: '이미 해당 강의실 권한이 있습니다.',
        orderId: existing.docs[0].id,
      })
    }

    const classroom = CLASSROOMS.find((c) => c.slug === classroomSlug)!

    // 테스트 주문 생성
    const orderNumber = `TEST_${Date.now().toString(36).toUpperCase()}`
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        buyerName: user.name || user.email,
        buyerEmail: user.email,
        buyerPhone: user.phone || '',
        user: user.id,
        productName: `[테스트] ${classroom.shortTitle}`,
        productType: 'class' as const,
        amount: 0,
        status: 'paid' as const,
        classrooms: [classroomSlug],
        adminMemo: `관리자(${(adminCheck === null ? 'admin' : '')}) 가 테스트용으로 부여한 강의실 권한입니다.`,
      } as any,
    })

    return NextResponse.json({
      ok: true,
      message: `${user.email} 에게 ${classroom.shortTitle} 권한을 부여했습니다.`,
      orderId: order.id,
    })
  } catch (err) {
    console.error('[GRANT_CLASSROOM] error:', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message || '권한 부여 실패' }, { status: 500 })
  }
}

/**
 * 관리자 전용 — 부여한 권한 회수 (테스트 주문 삭제).
 */
export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const url = new URL(request.url)
    const orderId = url.searchParams.get('orderId')
    if (!orderId) {
      return NextResponse.json({ error: 'orderId 필수' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    await payload.delete({ collection: 'orders', id: Number(orderId) })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
