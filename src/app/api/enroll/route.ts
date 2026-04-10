import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { sanitize, isValidEmail, isValidPhone } from '@/lib/sanitize'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  const { allowed } = rateLimit(`enroll:${ip}`, 5, 60000)
  if (!allowed) {
    return NextResponse.json({ error: '요청이 너무 많습니다.' }, { status: 429 })
  }

  try {
    const body = (await request.json()) as {
      name: string
      phone: string
      email: string
      program: string
      message?: string
    }

    const name = sanitize(body.name)
    const phone = sanitize(body.phone)
    const email = sanitize(body.email)
    const program = sanitize(body.program)
    const message = sanitize(body.message)

    if (!name || !phone || !email) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: '올바른 이메일 형식이 아닙니다.' }, { status: 400 })
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: '올바른 연락처 형식이 아닙니다.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // 중복 신청 체크
    const existing = await payload.find({
      collection: 'enrollments',
      where: {
        email: { equals: email },
        program: { equals: program || 'vibe-coding' },
        status: { not_equals: 'cancelled' },
      },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      return NextResponse.json({ error: '이미 해당 프로그램에 신청하셨습니다.' }, { status: 409 })
    }

    // 1. Enrollment 생성 (afterChange hook → 관리자알림 + 신청자 계좌안내 메일)
    await payload.create({
      collection: 'enrollments',
      data: {
        name,
        phone,
        email,
        program: program || 'vibe-coding',
        message: message || '',
        status: 'pending',
      },
    })

    // 2. Order도 동시 생성 (pending 상태)
    //    → admin에서 status를 'paid'로 바꾸면 자동으로:
    //      - 관리자에게 결제완료 알림
    //      - 구매자에게 수강안내 메일
    //      - classrooms 필드에 의해 강의실 접근 권한 부여
    let productTitle = program || '강의'
    let amount = 0
    let classrooms: string[] = []
    try {
      const prodResult = await payload.find({
        collection: 'products',
        where: { slug: { equals: program } },
        limit: 1,
        depth: 0,
      })
      const p = prodResult.docs[0] as any
      if (p) {
        productTitle = p.title || productTitle
        amount = p.price || 0
        if (p.classroomSlug) classrooms = [p.classroomSlug]
      }
    } catch {
      // Products 조회 실패 시 가격 0으로 생성
    }

    // 로그인된 사용자 연결
    let userId: number | null = null
    try {
      const { user } = await payload.auth({ headers: request.headers })
      if (user) userId = user.id as number
    } catch {
      // 비로그인
    }
    if (!userId) {
      try {
        const userResult = await payload.find({
          collection: 'users',
          where: { email: { equals: email.toLowerCase() } },
          limit: 1,
        })
        if (userResult.docs[0]) userId = userResult.docs[0].id as number
      } catch {
        // 회원 없음
      }
    }

    const orderNumber = `ENR${Date.now().toString(36).toUpperCase()}`
    const orderData: Record<string, unknown> = {
      orderNumber,
      buyerName: name,
      buyerEmail: email,
      buyerPhone: phone,
      productName: productTitle,
      productType: 'class',
      amount,
      status: 'pending',
      classrooms,
      adminMemo: `수강신청 폼에서 자동 생성 (program=${program})`,
    }
    if (userId) orderData.user = userId

    await payload.create({ collection: 'orders', data: orderData as any })

    return NextResponse.json({ ok: true, message: '신청이 접수되었습니다.' })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
