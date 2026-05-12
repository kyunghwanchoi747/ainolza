/**
 * verify 누락된 결제 건 복구.
 *
 * 시나리오:
 *   이니시스 결제 완료 → 결제창 광고 팝업 → 사용자가 창 닫음
 *   → /checkout/complete 미도달 → /api/payments/verify 호출 안 됨
 *   → 우리 DB는 pending, 이니시스는 완료. 불일치.
 *
 * 사용:
 *   ORDER_NUMBERS="ORD1,ORD2,ORD3" npx cross-env PAYLOAD_CLI=1 NODE_ENV=production tsx scripts/reconcile-missed-payments.ts
 *
 * 동작:
 *  1) 환경변수의 주문번호 목록을 순회
 *  2) PortOne API로 paymentId(=merchantUid) 결제 상태 조회
 *  3) PortOne 상태가 PAID 이면 우리 DB를 paid로 업데이트
 *     → afterChange hook이 강의실 권한 부여 + 결제완료 메일 자동 발송
 *  4) 금액 불일치/PortOne 미발견 등 안전 검증 포함
 */
// .env.local 명시 로드 — tsx는 자동 로드 안 함
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env.local' })
loadEnv({ path: '.env' })

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { resolveGrantedClassrooms } from '../src/lib/classroom-grant'

const ORDER_NUMBERS = (process.env.ORDER_NUMBERS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const PORTONE_SECRET = process.env.PORTONE_API_SECRET || ''

type PortOnePayment = {
  status?: string
  amount?: { total?: number }
  method?: { type?: string }
  pgProvider?: string
  receiptUrl?: string
  paidAt?: string
} & Record<string, any>

async function fetchPortOnePayment(paymentId: string): Promise<PortOnePayment | null> {
  if (!PORTONE_SECRET) {
    throw new Error('PORTONE_API_SECRET env required')
  }
  const url = `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`
  const res = await fetch(url, {
    headers: { Authorization: `PortOne ${PORTONE_SECRET}` },
  })
  if (!res.ok) {
    const t = await res.text()
    console.error(`  [portone] ${paymentId} ${res.status} ${t.slice(0, 200)}`)
    return null
  }
  return (await res.json()) as PortOnePayment
}

async function main() {
  if (ORDER_NUMBERS.length === 0) {
    console.error('ORDER_NUMBERS env required (comma-separated)')
    process.exit(1)
  }

  console.log(`[reconcile] starting. ${ORDER_NUMBERS.length} orders`)
  const payload = await getPayload({ config })

  let updated = 0
  let alreadyPaid = 0
  let markedFailed = 0
  let markedCancelled = 0
  let notPaidOnPortOne = 0
  let amountMismatch = 0
  let failed = 0

  for (const orderNumber of ORDER_NUMBERS) {
    console.log(`\n[${orderNumber}]`)

    const orderRes = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const order = orderRes.docs[0] as any
    if (!order) {
      console.error('  주문 없음 — skip')
      failed++
      continue
    }
    if (order.status === 'paid' || order.status === 'active' || order.status === 'completed') {
      console.log(`  이미 ${order.status} — skip`)
      alreadyPaid++
      continue
    }

    // PortOne paymentId는 우리 merchantUid 기준으로 채번됨 (V2: paymentId = merchantUid 사용)
    const paymentId = order.merchantUid || order.orderNumber
    const payment = await fetchPortOnePayment(paymentId)
    if (!payment) {
      console.error('  PortOne 조회 실패 — skip')
      failed++
      continue
    }

    console.log(`  portone status: ${payment.status}, amount: ${payment.amount?.total}`)

    // PAID 아닌 경우 — FAILED/CANCELLED는 우리 DB에도 동일하게 반영
    if (payment.status === 'FAILED') {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'failed', impUid: paymentId } as any,
        overrideAccess: true,
        context: { skipNotify: true },
      })
      console.log('  PortOne FAILED — DB도 failed 처리')
      markedFailed++
      continue
    }
    if (payment.status === 'CANCELLED') {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'cancelled', impUid: paymentId } as any,
        overrideAccess: true,
        context: { skipNotify: true },
      })
      console.log('  PortOne CANCELLED — DB도 cancelled 처리')
      markedCancelled++
      continue
    }
    if (payment.status !== 'PAID') {
      console.log(`  PortOne 상태 ${payment.status} — skip`)
      notPaidOnPortOne++
      continue
    }

    // 금액 검증
    if (typeof payment.amount?.total === 'number' && payment.amount.total !== order.amount) {
      console.error(`  ⚠️ 금액 불일치: 주문 ${order.amount}, 결제 ${payment.amount.total} — 수동 확인 필요`)
      amountMismatch++
      continue
    }

    // 결제수단 매핑
    const methodType = payment.method?.type || ''
    const payMethodMap: Record<string, string> = {
      PaymentMethodCard: 'card',
      PaymentMethodTransfer: 'trans',
      PaymentMethodVirtualAccount: 'vbank',
      PaymentMethodEasyPay: 'kakaopay',
      PaymentMethodMobile: 'phone',
    }
    const payMethod = payMethodMap[methodType] || undefined

    // 강의실 권한
    const productRes = await payload.find({
      collection: 'products',
      where: { slug: { equals: order.productSlug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const product = productRes.docs[0] as any
    const granted = resolveGrantedClassrooms(
      order.productSlug,
      product?.grantedClassroomSlugs,
      Array.isArray(order.classrooms) ? order.classrooms : [],
    )

    const updateData: Record<string, any> = {
      status: 'paid',
      impUid: paymentId,
      pgProvider: payment.pgProvider || undefined,
      receiptUrl: payment.receiptUrl || undefined,
      paidAt: payment.paidAt || new Date().toISOString(),
    }
    if (payMethod) updateData.payMethod = payMethod
    if (granted.length > 0) updateData.classrooms = granted

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: updateData as any,
      overrideAccess: true,
      // afterChange hook 정상 동작 → 결제완료 메일 + 권한 부여 자동
    })

    console.log(`  ✓ paid 전환. 강의실: ${granted.join(', ') || '(없음)'}`)
    updated++
  }

  console.log('\n========== reconcile summary ==========')
  console.log('updated to paid     :', updated)
  console.log('already paid        :', alreadyPaid)
  console.log('marked as failed    :', markedFailed)
  console.log('marked as cancelled :', markedCancelled)
  console.log('not paid on portone :', notPaidOnPortOne)
  console.log('amount mismatch     :', amountMismatch)
  console.log('failed              :', failed)
  console.log('=======================================')

  process.exit(0)
}

main().catch((e) => {
  console.error('[reconcile] fatal:', e)
  process.exit(1)
})
