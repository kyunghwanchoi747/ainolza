import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'

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
    if (!userId && !email) {
      return NextResponse.json({ error: 'userId 또는 email 필요' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // DB에서 강의실 존재 확인
    const classroomResult = await payload.find({
      collection: 'classrooms' as any,
      where: { slug: { equals: classroomSlug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const classroom = classroomResult.docs[0] as any
    if (!classroom) {
      return NextResponse.json({ error: '존재하지 않는 강의실' }, { status: 400 })
    }

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

    // 어드민에게 권한 부여 알림 메일
    try {
      const adminTo = process.env.ADMIN_EMAIL || 'rex39@naver.com'
      await payload.sendEmail({
        to: adminTo,
        subject: `[AI놀자] 강의실 권한 부여: ${user.name || user.email}`,
        html: `<p>회원: ${user.name || ''} (${user.email})<br>부여된 강의실: ${classroom.shortTitle}<br>주문번호: ${orderNumber}</p>`,
      })
    } catch (e) { console.error('[GRANT NOTIFY]', (e as Error).message) }

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
 * 관리자 전용 — 권한 회수.
 * - 테스트 주문(TEST_): 주문 자체 삭제
 * - 실제 주문: classrooms 배열에서 해당 강의실만 제거
 */
export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const url = new URL(request.url)
    const orderId = url.searchParams.get('orderId')
    const classroomSlug = url.searchParams.get('classroomSlug')
    if (!orderId) {
      return NextResponse.json({ error: 'orderId 필수' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const { headers } = await import('next/headers')
    const hdrs = await headers()
    const { user } = await payload.auth({ headers: hdrs as unknown as Headers })

    const order = await payload.findByID({ collection: 'orders', id: Number(orderId), overrideAccess: true })
    const isTest = typeof (order as any).orderNumber === 'string' && (order as any).orderNumber.startsWith('TEST_')

    if (isTest) {
      await payload.delete({ collection: 'orders', id: Number(orderId), overrideAccess: true, user: user ?? undefined })
    } else {
      if (!classroomSlug) {
        return NextResponse.json({ error: '실제 주문은 classroomSlug 필수' }, { status: 400 })
      }
      const currentClassrooms: string[] = Array.isArray((order as any).classrooms) ? (order as any).classrooms : []
      const updatedClassrooms = currentClassrooms.filter((c) => c !== classroomSlug)
      await payload.update({
        collection: 'orders',
        id: Number(orderId),
        data: { classrooms: updatedClassrooms } as any,
        overrideAccess: true,
        user: user ?? undefined,
      })
    }

    // 어드민에게 회수 알림 메일
    try {
      const adminTo = process.env.ADMIN_EMAIL || 'rex39@naver.com'
      const buyerEmail = (order as any).buyerEmail || ''
      const buyerName = (order as any).buyerName || ''
      const revokedSlug = isTest ? ((order as any).classrooms?.[0] || '') : (classroomSlug || '')
      let revokedTitle = revokedSlug
      try {
        const cr = await payload.find({
          collection: 'classrooms' as any,
          where: { slug: { equals: revokedSlug } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const c = cr.docs[0] as any
        if (c?.shortTitle) revokedTitle = c.shortTitle
      } catch { /* ignore */ }
      await payload.sendEmail({
        to: adminTo,
        subject: `[AI놀자] 강의실 권한 회수: ${buyerName || buyerEmail}`,
        html: `<p>회원: ${buyerName} (${buyerEmail})<br>회수된 강의실: ${revokedTitle}<br>주문번호: ${(order as any).orderNumber}</p>`,
      })
    } catch (e) { console.error('[REVOKE NOTIFY]', (e as Error).message) }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
