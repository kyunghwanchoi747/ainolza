/**
 * LEGACY_ 주문 일괄 마무리:
 *  1) paidAt을 강제로 101일 전 → 자동 만료 (수강 기간 종료)
 *  2) status를 'paid' → 'completed' (구매 확정)
 *
 * idempotent: 이미 completed + 만료된 주문은 skip
 *
 * 사용:
 *   npx cross-env PAYLOAD_CLI=1 NODE_ENV=production tsx scripts/finalize-legacy-orders.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const DRY_RUN = process.env.DRY_RUN === '1'

async function withRetry<T>(fn: () => Promise<T>, label: string, max = 3): Promise<T> {
  let lastErr: unknown
  for (let i = 1; i <= max; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      const msg = (e as Error).message || ''
      if (!/502|503|504|timeout|fetch failed|ECONNRESET/i.test(msg) || i === max) throw e
      const delay = 500 * i + Math.floor(Math.random() * 500)
      console.warn(`[retry] ${label} attempt ${i} failed, retry in ${delay}ms`)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw lastErr
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  console.log('[finalize] starting. DRY_RUN =', DRY_RUN)

  const payload = await getPayload({ config })

  // LEGACY_ 로 시작하는 모든 주문 조회 (paid/active/completed 무관)
  const result = await withRetry(
    () =>
      payload.find({
        collection: 'orders',
        where: { orderNumber: { like: 'LEGACY_%' } },
        limit: 500,
        overrideAccess: true,
      }),
    'find LEGACY orders',
  )

  console.log(`[finalize] found ${result.totalDocs} LEGACY orders`)

  // 만료를 위해 paidAt을 101일 전으로 (100일 수강기간 + 1)
  const expiredAt = new Date()
  expiredAt.setDate(expiredAt.getDate() - 101)
  const expiredIso = expiredAt.toISOString()

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const order of result.docs as any[]) {
    const needsStatusChange = order.status !== 'completed'
    const currentPaidAt = order.paidAt ? new Date(order.paidAt) : null
    const needsPaidAtChange = !currentPaidAt || currentPaidAt > expiredAt

    if (!needsStatusChange && !needsPaidAtChange) {
      skipped++
      continue
    }

    const patch: Record<string, any> = {}
    if (needsStatusChange) patch.status = 'completed'
    if (needsPaidAtChange) patch.paidAt = expiredIso

    if (DRY_RUN) {
      console.log(`[dry] ${order.orderNumber}: ${JSON.stringify(patch)}`)
      updated++
      continue
    }

    try {
      await withRetry(
        () =>
          payload.update({
            collection: 'orders',
            id: order.id,
            data: patch as any,
            overrideAccess: true,
            context: { skipNotify: true }, // afterChange 메일 차단
          }),
        `update ${order.orderNumber}`,
      )
      updated++
    } catch (e) {
      console.error(`[finalize] failed ${order.orderNumber}:`, (e as Error).message)
      failed++
    }
    await sleep(50)
  }

  console.log('========== finalize summary ==========')
  console.log('total LEGACY orders :', result.totalDocs)
  console.log('updated             :', updated)
  console.log('skipped (no change) :', skipped)
  console.log('failed              :', failed)
  console.log('======================================')

  process.exit(0)
}

main().catch((e) => {
  console.error('[finalize] fatal:', e)
  process.exit(1)
})
