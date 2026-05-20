import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'
import { resolveGrantedClassrooms } from '@/lib/classroom-grant'

/**
 * 매니저 전용 — paid 상태인데 강의실 권한이 누락된 주문 일괄 복구.
 *
 * sync-payment(PortOne 재조회 기반)와 달리, 무통장/네이버페이/카카오페이/매니저 수동 paid
 * 등 결제수단 무관하게 productSlug → 강의실 매핑만으로 누락 권한 부여.
 *
 * 입력:
 *  - { dryRun: true } — 누락 주문 목록만 반환(권한 부여 안 함)
 *  - { dryRun: false } 또는 미지정 — 실제 부여
 *  - { productSlugs: [...] } — 특정 상품만 (생략 시 모든 paid 주문 검사)
 *
 * 인증: admin 권한 OR CRON_KEY.
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const providedKey = url.searchParams.get('key') || request.headers.get('x-cron-key') || ''
  const expectedKey = process.env.CRON_KEY || ''
  const hasCronAuth = expectedKey && providedKey === expectedKey
  if (!hasCronAuth) {
    const adminCheck = await requireAdmin(request)
    if (adminCheck) return adminCheck
  }

  let body: { dryRun?: boolean; productSlugs?: string[] } = {}
  try {
    body = await request.json()
  } catch {
    // body 비어있어도 OK (전체 검사 + 실제 부여)
  }
  const dryRun = body.dryRun === true
  const filterSlugs = Array.isArray(body.productSlugs) && body.productSlugs.length > 0
    ? body.productSlugs
    : null

  const payload = await getPayloadClient()

  // 1. paid 주문 전체 조회 (productSlug 필터 옵션)
  const where: any = { status: { equals: 'paid' } }
  if (filterSlugs) {
    where.productSlug = { in: filterSlugs }
  }
  const result = await payload.find({
    collection: 'orders',
    where,
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })

  // 2. 상품 정보 캐시 (같은 상품 여러 번 조회 안 하도록)
  const productCache = new Map<string, unknown>()
  const getProductGranted = async (slug: string): Promise<unknown> => {
    if (productCache.has(slug)) return productCache.get(slug)
    try {
      const r = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const g = (r.docs[0] as any)?.grantedClassroomSlugs ?? null
      productCache.set(slug, g)
      return g
    } catch {
      productCache.set(slug, null)
      return null
    }
  }

  // 3. 각 주문에 대해 기대 강의실 vs 실제 강의실 비교 → 누락만 부여
  const granted: any[] = []
  const skipped: any[] = []
  const failed: any[] = []

  for (const o of result.docs as any[]) {
    if (!o.productSlug) {
      skipped.push({ id: o.id, orderNumber: o.orderNumber, reason: 'no productSlug' })
      continue
    }
    const existing: string[] = Array.isArray(o.classrooms) ? [...o.classrooms] : []
    const productGranted = await getProductGranted(o.productSlug)
    const resolved = resolveGrantedClassrooms(o.productSlug, productGranted, existing)
    const added = resolved.filter((s) => !existing.includes(s))

    if (added.length === 0) {
      skipped.push({
        id: o.id,
        orderNumber: o.orderNumber,
        buyerName: o.buyerName,
        productSlug: o.productSlug,
        classrooms: existing,
        reason: 'already complete',
      })
      continue
    }

    if (dryRun) {
      granted.push({
        id: o.id,
        orderNumber: o.orderNumber,
        buyerName: o.buyerName,
        buyerEmail: o.buyerEmail,
        productSlug: o.productSlug,
        before: existing,
        willAdd: added,
        after: resolved,
      })
      continue
    }

    try {
      await payload.update({
        collection: 'orders',
        id: o.id,
        data: { classrooms: resolved } as any,
        overrideAccess: true,
        context: { skipNotify: true } as any, // afterChange에서 중복 메일 발송 막기 (이미 paid 상태)
      })
      granted.push({
        id: o.id,
        orderNumber: o.orderNumber,
        buyerName: o.buyerName,
        buyerEmail: o.buyerEmail,
        productSlug: o.productSlug,
        added,
      })
    } catch (e) {
      failed.push({
        id: o.id,
        orderNumber: o.orderNumber,
        buyerName: o.buyerName,
        error: (e as Error).message,
      })
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    totals: {
      paid: result.totalDocs,
      granted: granted.length,
      skipped: skipped.length,
      failed: failed.length,
    },
    granted,
    skipped,
    failed,
  })
}
