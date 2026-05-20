import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit, getClientIP } from '@/lib/rate-limit'
import { sendWaitlistReceived, sendWaitlistAdminAlert } from '@/lib/email-templates'

/**
 * 대기 신청 접수.
 *
 * 입력: { productSlug, buyerName, buyerEmail, buyerPhone?, motivation?, source? }
 * 처리:
 *  1. 상품 조회 → waitlistMode가 true가 아니면 거부 (정상 결제 가능 상품을 우회로 대기 신청하는 케이스 차단)
 *  2. 같은 이메일 + 같은 productSlug 중복 신청은 200으로 무시(idempotent)
 *  3. 로그인 상태면 user 관계 자동 연결
 *  4. 신청자 + 관리자 각각 메일 발송
 *
 * 인증: 비로그인도 허용 (대기자를 넓게 받기). rate limit으로 남용 차단.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  const { allowed } = rateLimit(`waitlist:${ip}`, 5, 60_000) // 분당 5회
  if (!allowed) {
    return NextResponse.json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }, { status: 429 })
  }

  let body: {
    productSlug?: string
    buyerName?: string
    buyerEmail?: string
    buyerPhone?: string
    motivation?: string
    source?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const productSlug = (body.productSlug || '').trim()
  const buyerName = (body.buyerName || '').trim()
  const buyerEmail = (body.buyerEmail || '').trim().toLowerCase()
  const buyerPhone = (body.buyerPhone || '').trim() || undefined
  const motivation = (body.motivation || '').trim() || undefined
  const source = (body.source || '').trim() || undefined

  if (!productSlug) return NextResponse.json({ error: 'productSlug 필수' }, { status: 400 })
  if (!buyerName) return NextResponse.json({ error: '이름을 입력해주세요.' }, { status: 400 })
  if (!buyerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
    return NextResponse.json({ error: '올바른 이메일을 입력해주세요.' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  // 1. 상품 조회 + waitlistMode 검증
  let productName = ''
  try {
    const prodRes = await payload.find({
      collection: 'products',
      where: { slug: { equals: productSlug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const product = prodRes.docs[0] as any
    if (!product) {
      return NextResponse.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 })
    }
    if (!product.waitlistMode) {
      return NextResponse.json(
        { error: '현재 모집 중인 상품입니다. 결제 페이지에서 신청해주세요.' },
        { status: 400 },
      )
    }
    productName = product.title || product.name || productSlug
  } catch (e) {
    console.error('[waitlist] product lookup', (e as Error).message)
    return NextResponse.json({ error: '상품 정보를 불러오지 못했습니다.' }, { status: 500 })
  }

  // 2. 중복 체크 — 같은 이메일 + 같은 상품 + active 상태
  try {
    const dup = await payload.find({
      collection: 'waitlists',
      where: {
        and: [
          { productSlug: { equals: productSlug } },
          { buyerEmail: { equals: buyerEmail } },
          { status: { equals: 'active' } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (dup.totalDocs > 0) {
      return NextResponse.json({ ok: true, dedup: true, message: '이미 대기 신청이 접수되어 있습니다.' })
    }
  } catch {
    // 중복 체크 실패는 본질이 아님 — 계속 진행
  }

  // 3. 로그인 상태면 user 관계 연결
  let userId: number | undefined
  try {
    const { user } = await payload.auth({ headers: request.headers })
    if (user) userId = (user as any).id
  } catch {
    // 비로그인 OK
  }

  // 4. 저장
  let created: any
  try {
    created = await payload.create({
      collection: 'waitlists',
      data: {
        productSlug,
        productName,
        buyerName,
        buyerEmail,
        buyerPhone,
        motivation,
        source,
        user: userId,
        status: 'active',
      } as any,
      overrideAccess: true,
    })
  } catch (e) {
    console.error('[waitlist] create', (e as Error).message)
    return NextResponse.json({ error: '신청 저장에 실패했습니다.' }, { status: 500 })
  }

  // 5. 메일 발송 — 신청자 + 관리자
  try {
    await sendWaitlistReceived(payload, { buyerEmail, buyerName, productName })
  } catch (e) {
    console.error('[waitlist] buyer mail', (e as Error).message)
    // 사용자 응답에는 영향 없음 — 저장은 성공
  }
  // 관리자 메일은 await 안에서 throw 안 함
  await sendWaitlistAdminAlert(payload, { buyerName, buyerEmail, buyerPhone, productSlug, productName, motivation })

  return NextResponse.json({ ok: true, id: created.id })
}
