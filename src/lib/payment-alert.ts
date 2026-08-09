/**
 * 결제 장애 알림
 *
 * 2026-08-09 사고 대응으로 신설.
 * 당시 orders 테이블에 vbank_reminder_sent 컬럼이 없어 카드/계좌이체/무통장
 * 주문 생성이 전부 실패했는데, 아무 알림이 없어 한동안 아무도 몰랐음.
 *
 * 설계 원칙 — 알림 실패가 절대 결제 흐름을 막아서는 안 된다:
 *  - 모든 발송은 try/catch로 격리. 실패해도 호출부로 예외를 던지지 않는다.
 *  - 메일과 웹훅은 서로 독립. 한쪽이 죽어도 다른 쪽은 발송된다.
 *  - 이번 사고처럼 DB가 원인이면 payload.sendEmail 도 같이 죽을 수 있으므로
 *    DB에 의존하지 않는 웹훅을 이중 안전망으로 둔다.
 */

import type { Payload } from 'payload'

function adminEmail(): string {
  return process.env.ADMIN_EMAIL || 'rex39@naver.com'
}

export type PaymentAlertContext = {
  stage: string
  error: unknown
  orderNumber?: string
  buyerName?: string
  buyerEmail?: string
  productName?: string
  amount?: number
  payMethod?: string
}

function errText(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

/** DB 스키마 불일치(이번 사고 유형)인지 판별 — 메일 본문에 조치 힌트를 넣기 위함 */
function schemaHint(msg: string): string | null {
  if (/no such column|has no column named|no such table/i.test(msg)) {
    return 'DB 스키마 불일치로 보입니다. 마이그레이션이 운영 DB에 반영되지 않았을 가능성이 높습니다 (src/migrations/index.ts 등록 여부 확인).'
  }
  return null
}

function fmtAmount(amount?: number): string {
  return typeof amount === 'number' ? amount.toLocaleString('ko-KR') + '원' : '-'
}

/**
 * 웹훅 알림 — 카카오워크/슬랙/디스코드 등 Incoming Webhook URL.
 * PAYMENT_ALERT_WEBHOOK_URL 이 없으면 조용히 건너뛴다(설정 전에도 안전).
 */
async function sendWebhook(text: string): Promise<void> {
  const url = process.env.PAYMENT_ALERT_WEBHOOK_URL
  if (!url) return
  try {
    // 알림 때문에 응답이 지연되지 않도록 타임아웃을 짧게 둔다
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Slack/카카오워크/디스코드 모두 text 필드를 인식
      body: JSON.stringify({ text, content: text }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      console.error('[PAYMENT ALERT] 웹훅 응답 오류:', res.status)
    }
  } catch (e) {
    console.error('[PAYMENT ALERT] 웹훅 발송 실패:', (e as Error).message)
  }
}

/**
 * 주문 생성 실패 알림. 메일 + 웹훅 동시 발송.
 * 절대 throw 하지 않는다 — 호출부는 await 만 하고 결과를 신경 쓰지 않아도 된다.
 */
export async function notifyPaymentFailure(
  payload: Payload | null,
  ctx: PaymentAlertContext,
): Promise<void> {
  const msg = errText(ctx.error)
  const when = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  const hint = schemaHint(msg)

  // 로그는 무조건 남긴다 (Cloudflare observability에서 검색 가능)
  console.error('[PAYMENT FAILURE]', ctx.stage, msg)

  const plain = [
    '[AI놀자] 결제 오류 발생',
    '',
    `발생 시각: ${when}`,
    `단계: ${ctx.stage}`,
    `주문번호: ${ctx.orderNumber || '(생성 전)'}`,
    `상품: ${ctx.productName || '-'}`,
    `금액: ${fmtAmount(ctx.amount)}`,
    `결제수단: ${ctx.payMethod || '-'}`,
    `구매자: ${ctx.buyerName || '-'} (${ctx.buyerEmail || '-'})`,
    '',
    `오류: ${msg}`,
    hint ? `\n조치 힌트: ${hint}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  // 웹훅과 메일을 독립적으로 발송 — 한쪽 실패가 다른 쪽을 막지 않도록 allSettled
  await Promise.allSettled([
    sendWebhook(plain),
    (async () => {
      if (!payload) return
      try {
        const row = (label: string, value: string) =>
          `<tr><td style="padding:6px 0;color:#888888;font-size:13px;width:96px;">${label}</td><td style="padding:6px 0;color:#1a1a1a;font-size:13px;">${value}</td></tr>`
        const esc = (s: string) =>
          s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        await payload.sendEmail({
          to: adminEmail(),
          subject: `[AI놀자] 결제 오류 — ${ctx.stage}${ctx.orderNumber ? ` (${ctx.orderNumber})` : ''}`,
          html: `<div style="font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;max-width:560px;">
  <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 6px;">결제 오류가 발생했습니다</h2>
  <p style="color:#888888;font-size:13px;margin:0 0 20px;">${when}</p>
  <table style="width:100%;border-collapse:collapse;border-top:1px solid #dddddd;">
    ${row('단계', esc(ctx.stage))}
    ${row('주문번호', esc(ctx.orderNumber || '(생성 전)'))}
    ${row('상품', esc(ctx.productName || '-'))}
    ${row('금액', fmtAmount(ctx.amount))}
    ${row('결제수단', esc(ctx.payMethod || '-'))}
    ${row('구매자', esc(`${ctx.buyerName || '-'} (${ctx.buyerEmail || '-'})`))}
  </table>
  <div style="margin-top:20px;padding:14px 16px;background:#fafafa;border:1px solid #dddddd;border-radius:8px;">
    <p style="color:#888888;font-size:12px;margin:0 0 6px;">오류 메시지</p>
    <p style="color:#1a1a1a;font-size:13px;margin:0;word-break:break-all;font-family:monospace;">${esc(msg)}</p>
  </div>
  ${
    hint
      ? `<div style="margin-top:12px;padding:14px 16px;background:#fff8f7;border:1px solid #D4756E;border-radius:8px;">
    <p style="color:#D4756E;font-size:12px;margin:0 0 6px;font-weight:bold;">조치 힌트</p>
    <p style="color:#1a1a1a;font-size:13px;margin:0;">${esc(hint)}</p>
  </div>`
      : ''
  }
</div>`,
          text: plain,
        })
      } catch (e) {
        console.error('[PAYMENT ALERT] 메일 발송 실패:', (e as Error).message)
      }
    })(),
  ])
}
