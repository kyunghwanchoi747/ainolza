import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getPayloadClient } from '@/lib/payload'

/**
 * 전자책 다운로드 — 인증·권한 검증 후 R2에서 직접 스트리밍 응답
 *
 * GET /api/download/[orderId]
 *
 * 흐름:
 *  1. 로그인된 사용자인지 확인
 *  2. 해당 orderId가 본인 주문이고 paid/active/completed 상태인지
 *  3. 주문 상품이 ebook 유형이고 ebookFile이 연결돼있는지
 *  4. R2 binding(env.R2)으로 객체를 가져와 PDF 바이너리 스트리밍
 *  5. Cache-Control: private, no-store — CDN/브라우저 캐시 차단
 *
 * 보안 특성:
 *  - 매 요청마다 인증·권한 검증 → 링크 공유해도 본인 외엔 받을 수 없음
 *  - presigned URL이 아닌 워커 직접 스트리밍이라 외부 캐시·재사용 불가
 *  - 다운로드된 PDF 파일 자체는 사용자 디바이스에 저장됨 (DRM 아님)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params
  if (!orderId) return NextResponse.json({ error: '주문 정보 없음' }, { status: 400 })

  // 1. 로그인 체크
  const payload = await getPayloadClient()
  const hdrs = await headers()
  const { user } = await payload.auth({ headers: hdrs as unknown as Headers })
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // 2. 주문 조회 + 본인 검증
  let order: any
  try {
    order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 0,
      overrideAccess: true,
    })
  } catch {
    return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
  }
  if (!order) {
    return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
  }

  const orderUserId = typeof order.user === 'object' ? order.user?.id : order.user
  const isAdmin = (user as { role?: string }).role === 'admin'
  if (!isAdmin && orderUserId !== (user as any).id) {
    return NextResponse.json({ error: '본인의 주문이 아닙니다.' }, { status: 403 })
  }

  // 3. 결제 상태
  if (!['paid', 'active', 'completed'].includes(order.status)) {
    return NextResponse.json(
      { error: '결제 완료된 주문에 대해서만 다운로드가 가능합니다.' },
      { status: 403 },
    )
  }

  // 4. 상품 조회 + 전자책 검증
  if (!order.productSlug) {
    return NextResponse.json({ error: '상품 정보가 없는 주문입니다.' }, { status: 400 })
  }
  const productResult = await payload.find({
    collection: 'products',
    where: { slug: { equals: order.productSlug } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const product = productResult.docs[0] as any
  if (!product) {
    return NextResponse.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 })
  }
  if (product.productType !== 'ebook') {
    return NextResponse.json({ error: '전자책 상품이 아닙니다.' }, { status: 400 })
  }

  const ebookFile = product.ebookFile
  if (!ebookFile || typeof ebookFile !== 'object') {
    return NextResponse.json(
      { error: '전자책 파일이 등록되지 않았습니다. 관리자에게 문의해주세요.' },
      { status: 404 },
    )
  }

  const filename: string | undefined = ebookFile.filename
  const prefix: string = ebookFile.prefix || ''
  const mimeType: string = ebookFile.mimeType || 'application/pdf'
  if (!filename) {
    return NextResponse.json({ error: '파일명이 비어있습니다.' }, { status: 500 })
  }

  // 5. R2 binding으로 직접 객체 가져오기
  const { env } = await getCloudflareContext({ async: true })
  const r2 = (env as any).R2
  if (!r2) {
    return NextResponse.json({ error: 'R2 설정 오류' }, { status: 500 })
  }
  const objectKey = prefix ? `${prefix}/${filename}` : filename
  const object = await r2.get(objectKey)
  if (!object) {
    return NextResponse.json(
      { error: 'R2에서 파일을 찾을 수 없습니다.' },
      { status: 404 },
    )
  }

  // 6. 응답 — 다운로드 강제
  const buyerName = (order.buyerName || (user as any).name || 'user').replace(/[^A-Za-z0-9가-힣_-]/g, '_')
  const downloadName = `${product.title || 'ebook'}_${buyerName}.pdf`
  return new Response(object.body as any, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      // 강제 다운로드 (브라우저가 PDF를 인라인 표시하지 않고 저장 다이얼로그 표시)
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
      // 캐시 차단 (각 요청마다 권한 재검증)
      'Cache-Control': 'private, no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
    },
  })
}
