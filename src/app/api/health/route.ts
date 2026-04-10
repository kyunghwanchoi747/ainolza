import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

/**
 * 핵심 API 헬스체크 엔드포인트
 * GET /api/health → 모든 핵심 기능 점검 후 결과 반환
 *
 * 외부 모니터링(UptimeRobot 등)이나 Cloudflare Cron으로 5분마다 호출.
 * 하나라도 실패하면 관리자에게 자동 알림.
 */
export async function GET() {
  const results: Record<string, { ok: boolean; ms: number; error?: string }> = {}
  const start = Date.now()

  try {
    const payload = await getPayloadClient()

    // 1. DB READ 테스트
    const t1 = Date.now()
    try {
      await payload.find({ collection: 'users', limit: 1, depth: 0 })
      results.dbRead = { ok: true, ms: Date.now() - t1 }
    } catch (e) {
      results.dbRead = { ok: false, ms: Date.now() - t1, error: (e as Error).message }
    }

    // 2. DB WRITE 테스트 (email_logs는 제거됐으니 orders로 가벼운 read/count)
    const t2 = Date.now()
    try {
      await payload.count({ collection: 'orders' })
      results.dbCount = { ok: true, ms: Date.now() - t2 }
    } catch (e) {
      results.dbCount = { ok: false, ms: Date.now() - t2, error: (e as Error).message }
    }

    // 3. Products 조회 (store 페이지 작동 여부)
    const t3 = Date.now()
    try {
      const prods = await payload.find({ collection: 'products', limit: 1, depth: 0 })
      results.products = { ok: prods.totalDocs > 0, ms: Date.now() - t3 }
    } catch (e) {
      results.products = { ok: false, ms: Date.now() - t3, error: (e as Error).message }
    }

    // 4. DB WRITE 테스트 (실제 update — 자기 자신 meta 업데이트)
    const t4 = Date.now()
    try {
      // 첫 번째 주문의 adminMemo만 업데이트 (무해)
      const orders = await payload.find({ collection: 'orders', limit: 1, depth: 0 })
      if (orders.docs[0]) {
        await payload.update({
          collection: 'orders',
          id: (orders.docs[0] as any).id,
          data: { adminMemo: `health-check ${new Date().toISOString()}` },
        })
        results.dbWrite = { ok: true, ms: Date.now() - t4 }
      } else {
        results.dbWrite = { ok: true, ms: Date.now() - t4 } // 주문 0건이면 write 스킵
      }
    } catch (e) {
      results.dbWrite = { ok: false, ms: Date.now() - t4, error: (e as Error).message }
    }

    // 5. 이메일 발송 가능 여부 (실제 발송은 안 함, adapter 존재만 확인)
    results.emailAdapter = {
      ok: typeof payload.sendEmail === 'function',
      ms: 0,
    }
  } catch (e) {
    results.payload = { ok: false, ms: Date.now() - start, error: (e as Error).message }
  }

  const allOk = Object.values(results).every((r) => r.ok)
  const totalMs = Date.now() - start

  // 실패 항목이 있으면 관리자에게 알림 (5분에 1번만 오도록 밖에서 제어)
  if (!allOk) {
    const failedItems = Object.entries(results)
      .filter(([, v]) => !v.ok)
      .map(([k, v]) => `${k}: ${v.error || 'FAIL'}`)

    try {
      const payload = await getPayloadClient()
      await payload.sendEmail({
        to: process.env.ADMIN_EMAIL || 'rex39@naver.com',
        subject: `[AI놀자 긴급] 🚨 헬스체크 실패 — ${failedItems.length}건`,
        html: `<h2>헬스체크 실패</h2><pre>${JSON.stringify(results, null, 2)}</pre><p>시각: ${new Date().toISOString()}</p>`,
      })
    } catch {
      // 이메일도 안 되면 그냥 응답에만 포함
    }
  }

  return NextResponse.json(
    { status: allOk ? 'healthy' : 'unhealthy', totalMs, results },
    { status: allOk ? 200 : 503 },
  )
}
