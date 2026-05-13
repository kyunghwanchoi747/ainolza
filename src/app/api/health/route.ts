import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

/**
 * 핵심 API 헬스체크 엔드포인트.
 * GET /api/health → 핵심 기능 점검 후 200/503 반환.
 *
 * 정책:
 *  - 이 엔드포인트는 "상태"만 돌려준다. 알림은 외부 모니터(UptimeRobot, PortOne 등)에 위임.
 *  - 과거에는 실패 시 관리자 메일을 직접 보냈으나, throttle이 없어 1분 폴링 × 503이면
 *    분당 메일 1통 폭주가 발생함 → 메일 발송 로직 제거. 책임 분리.
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

    // 2. count 쿼리
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

    // 4. DB WRITE 테스트 (실제 update — adminMemo 갱신, 무해)
    const t4 = Date.now()
    try {
      const orders = await payload.find({ collection: 'orders', limit: 1, depth: 0 })
      if (orders.docs[0]) {
        await payload.update({
          collection: 'orders',
          id: (orders.docs[0] as any).id,
          data: { adminMemo: `health-check ${new Date().toISOString()}` },
        })
        results.dbWrite = { ok: true, ms: Date.now() - t4 }
      } else {
        results.dbWrite = { ok: true, ms: Date.now() - t4 }
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

  return NextResponse.json(
    { status: allOk ? 'healthy' : 'unhealthy', totalMs, results },
    { status: allOk ? 200 : 503 },
  )
}
