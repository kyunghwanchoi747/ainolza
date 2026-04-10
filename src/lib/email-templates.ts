/**
 * 이메일 발송 헬퍼 + 템플릿
 *
 * Payload의 payload.sendEmail() 을 통해 발송 (이미 worker-mailer + AWS SES 연동됨)
 * 운영자(admin) 이메일은 ADMIN_EMAIL 환경변수, 미설정 시 rex39@naver.com 폴백
 */

import type { Payload } from 'payload'

const KAKAO_OPEN_CHAT = 'https://open.kakao.com/o/s7kkWTfh'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ainolza.kr'

function adminEmail(): string {
  return process.env.ADMIN_EMAIL || 'rex39@naver.com'
}

/**
 * 이메일 발송 로그를 DB에 저장.
 * 각 hook에서 sendEmail 호출 후 이 함수를 호출하면 됨.
 */
export async function logEmailSent(
  payload: Payload,
  data: { to: string; subject: string; type: string; status?: 'sent' | 'failed'; error?: string; relatedId?: string },
): Promise<void> {
  try {
    await payload.create({
      collection: 'email-logs' as any,
      data: { ...data, status: data.status || 'sent' },
    })
  } catch {
    // 로그 저장 실패는 무시
  }
}

function priceKR(amount?: number): string {
  if (!amount) return '0원'
  return amount.toLocaleString('ko-KR') + '원'
}

const wrap = (title: string, bodyHtml: string) => `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;padding:48px 40px;">
        <tr><td>
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#D4756E;font-size:24px;font-weight:bold;margin:0;">AI놀자</h1>
          </div>
          <h2 style="color:#333;font-size:20px;font-weight:bold;margin:0 0 16px;">${title}</h2>
          ${bodyHtml}
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px;">
          <p style="color:#999;font-size:11px;text-align:center;margin:0;">© AI놀자 · info@ainolza.kr</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

// ==========================================
// 사용자용
// ==========================================

/** 회원가입 환영 메일 */
export async function sendWelcomeEmail(payload: Payload, user: { email: string; name?: string | null }) {
  const name = user.name || user.email.split('@')[0]
  await payload.sendEmail({
    to: user.email,
    subject: '[AI놀자] 가입을 환영합니다! 🎉',
    html: wrap(
      `${name}님, 환영합니다! 🎉`,
      `
      <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 16px;">
        AI놀자에 가입해 주셔서 감사합니다.
      </p>
      <p style="color:#666;font-size:14px;line-height:1.7;margin:0 0 24px;">
        AI놀자는 평범한 사람을 위한 AI 활용 강의와 도구를 만드는 공간입니다.
        강의·전자책 구매부터 AI 도구 활용까지 다양한 콘텐츠를 만나보세요.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${SITE_URL}/store" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">강의/책 보러가기</a>
      </div>
      <p style="color:#999;font-size:12px;line-height:1.6;margin:24px 0 0;">
        궁금한 점이 있으시면 <a href="${KAKAO_OPEN_CHAT}" style="color:#D4756E;">카카오톡 문의</a>로 연락주세요.
      </p>`,
    ),
  })
}

/** 결제 완료 → 사용자에게 수강 안내 */
export async function sendPaymentCompletedToBuyer(
  payload: Payload,
  order: { orderNumber: string; buyerName?: string | null; buyerEmail: string; productName: string; amount?: number | null; classrooms?: string[] | null },
) {
  const name = order.buyerName || order.buyerEmail.split('@')[0]
  const hasClassroom = Array.isArray(order.classrooms) && order.classrooms.length > 0
  await payload.sendEmail({
    to: order.buyerEmail,
    subject: '[AI놀자] 결제가 완료되었습니다',
    html: wrap(
      `${name}님, 결제가 완료되었습니다 ✨`,
      `
      <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 16px;">
        주문해 주셔서 감사합니다. 결제가 정상 처리되었습니다.
      </p>
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">주문번호</td><td>${order.orderNumber}</td></tr>
        <tr><td style="color:#999;">상품</td><td><strong style="color:#333;">${order.productName}</strong></td></tr>
        <tr><td style="color:#999;">결제금액</td><td><strong style="color:#D4756E;">${priceKR(order.amount || 0)}</strong></td></tr>
      </table>
      ${
        hasClassroom
          ? `
        <h3 style="color:#333;font-size:15px;margin:24px 0 8px;">🎓 수강 시작하기</h3>
        <p style="color:#666;font-size:14px;line-height:1.7;margin:0 0 16px;">
          마이페이지의 <strong>"내 강의실"</strong>에서 강의를 시청하실 수 있습니다.
          영상은 회차별로 정리되어 있으며, 각 회차마다 노션 가이드북이 함께 제공됩니다.
        </p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">내 강의실로 이동</a>
        </div>`
          : `
        <p style="color:#666;font-size:14px;line-height:1.7;margin:0 0 16px;">
          마이페이지에서 주문 내역을 확인하실 수 있습니다.
        </p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">마이페이지</a>
        </div>`
      }
      <p style="color:#999;font-size:12px;line-height:1.6;margin:24px 0 0;">
        문의사항은 <a href="${KAKAO_OPEN_CHAT}" style="color:#D4756E;">카카오톡 오픈채팅</a>으로 부탁드립니다.
      </p>`,
    ),
  })
}

/** 환불 처리 완료 → 사용자에게 안내 */
export async function sendRefundCompletedToBuyer(
  payload: Payload,
  order: { orderNumber: string; buyerName?: string | null; buyerEmail: string; productName: string; amount?: number | null },
) {
  const name = order.buyerName || order.buyerEmail.split('@')[0]
  await payload.sendEmail({
    to: order.buyerEmail,
    subject: '[AI놀자] 환불이 완료되었습니다',
    html: wrap(
      `${name}님, 환불이 완료되었습니다`,
      `
      <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 16px;">
        요청하신 환불이 정상 처리되었습니다.
      </p>
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">주문번호</td><td>${order.orderNumber}</td></tr>
        <tr><td style="color:#999;">상품</td><td>${order.productName}</td></tr>
        <tr><td style="color:#999;">환불금액</td><td><strong style="color:#D4756E;">${priceKR(order.amount || 0)}</strong></td></tr>
      </table>
      <p style="color:#666;font-size:14px;line-height:1.7;margin:0 0 16px;">
        환불 금액은 결제 수단에 따라 영업일 기준 3~7일 내 입금됩니다.
        문의사항이 있으시면 언제든 연락주세요.
      </p>
      <p style="color:#999;font-size:12px;line-height:1.6;margin:24px 0 0;">
        문의: <a href="${KAKAO_OPEN_CHAT}" style="color:#D4756E;">카카오톡 오픈채팅</a>
      </p>`,
    ),
  })
}

/** 심화반 결제 시 → 단톡방 안내 자동 발송 */
export async function sendAdvancedClassGroupChat(
  payload: Payload,
  order: { buyerName?: string | null; buyerEmail: string },
) {
  const name = order.buyerName || order.buyerEmail.split('@')[0]
  await payload.sendEmail({
    to: order.buyerEmail,
    subject: '[AI놀자] 바이브코딩 심화반 전용 단톡방 초대 및 입장 안내',
    html: wrap(
      `[바이브코딩 심화반] 전용 단톡방 초대 및 입장 안내`,
      `
      <p style="color:#444;font-size:15px;line-height:1.8;margin:0 0 16px;">
        안녕하세요, ${name}님.<br>
        바이브코딩 심화반에 합류하신 것을 진심으로 환영합니다.
      </p>
      <p style="color:#444;font-size:15px;line-height:1.8;margin:0 0 16px;">
        본격적인 시작을 위해 <strong style="color:#1a1a1a;">심화반 전용 단톡방</strong> 입장을 안내해 드립니다.
      </p>
      <p style="color:#666;font-size:14px;line-height:1.8;margin:0 0 24px;">
        지난 입문자반 진행 당시, 안내된 링크를 찾지 못해 입장이 지연되거나 오류를 겪으신 분들이 많았습니다.
        원활한 소통과 공지 전달을 위해, 반드시 결제 시 기재하신 이메일함(스팸함 포함)과 문자 메시지를 꼼꼼히 확인해 주시고
        아래 링크를 통해 오류 없이 입장해 주시기 바랍니다.
      </p>
      <table cellpadding="12" cellspacing="0" style="width:100%;background:#FFF1F0;border:2px solid #D4756E;border-radius:12px;margin:0 0 24px;font-size:15px;color:#1a1a1a;">
        <tr><td style="color:#888;font-weight:bold;width:160px;">👉 단톡방 입장 링크</td><td><a href="https://open.kakao.com/o/gbmc0ppi" style="color:#D4756E;font-weight:bold;text-decoration:underline;">https://open.kakao.com/o/gbmc0ppi</a></td></tr>
        <tr><td style="color:#888;font-weight:bold;">👉 참여 코드(비밀번호)</td><td><strong style="font-size:18px;">nolza232</strong></td></tr>
      </table>
      <p style="color:#444;font-size:14px;line-height:1.8;margin:0 0 16px;">
        상세한 안내는 단톡방을 통해 순차적으로 공지해 드리겠습니다.
      </p>
      <p style="color:#444;font-size:14px;margin:0;">감사합니다.</p>`,
    ),
  })
}

// ==========================================
// 관리자용
// ==========================================

/** 신규 회원가입 → 관리자 알림 */
export async function sendUserSignupToAdmin(
  payload: Payload,
  user: { id: number | string; email: string; name?: string | null; phone?: string | null; googleId?: string | null; kakaoId?: string | null; naverId?: string | null },
) {
  const provider = user.googleId
    ? 'Google OAuth'
    : user.kakaoId
      ? '카카오 OAuth'
      : user.naverId
        ? '네이버 OAuth'
        : '이메일 가입'
  await payload.sendEmail({
    to: adminEmail(),
    subject: `[AI놀자 알림] 🆕 새 회원 가입 — ${user.email}`,
    html: wrap(
      '🆕 새 회원이 가입했습니다',
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">이메일</td><td><strong style="color:#333;">${user.email}</strong></td></tr>
        <tr><td style="color:#999;">이름</td><td>${user.name || '-'}</td></tr>
        <tr><td style="color:#999;">연락처</td><td>${user.phone || '-'}</td></tr>
        <tr><td style="color:#999;">가입경로</td><td>${provider}</td></tr>
      </table>
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/admin/collections/users/${user.id}" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">회원 상세 보기</a>
      </div>`,
    ),
  })
}

/** 수강 신청 접수 → 신청자에게 계좌 안내 메일 */
export async function sendEnrollmentConfirmToBuyer(
  payload: Payload,
  enrollment: { name: string; email: string; program?: string | null },
  product?: { title?: string; price?: number; originalPrice?: number } | null,
) {
  const name = enrollment.name || enrollment.email.split('@')[0]
  const programTitle = product?.title || enrollment.program || '강의'
  const priceText = product?.price ? priceKR(product.price) : '금액 별도 안내'
  await payload.sendEmail({
    to: enrollment.email,
    subject: '[AI놀자] 수강 신청이 접수되었습니다 — 입금 안내',
    html: wrap(
      `${name}님, 수강 신청이 접수되었습니다`,
      `
      <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 16px;">
        <strong>${programTitle}</strong> 수강 신청이 정상 접수되었습니다.
        아래 계좌로 입금해 주시면 확인 후 수강 안내를 보내드립니다.
      </p>

      <table cellpadding="8" cellspacing="0" style="width:100%;background:#FFF1F0;border:2px solid #D4756E;border-radius:12px;margin:0 0 24px;font-size:14px;color:#333;">
        <tr><td style="width:80px;color:#888;font-weight:bold;">은행</td><td><strong>토스뱅크</strong></td></tr>
        <tr><td style="color:#888;font-weight:bold;">계좌번호</td><td><strong style="font-size:18px;color:#1a1a1a;">1000-1041-3507</strong></td></tr>
        <tr><td style="color:#888;font-weight:bold;">예금주</td><td><strong>최경환</strong></td></tr>
        <tr><td style="color:#888;font-weight:bold;">금액</td><td><strong style="font-size:18px;color:#D4756E;">${priceText}</strong></td></tr>
      </table>

      <div style="background:#fafafa;border-radius:10px;padding:16px;margin:0 0 24px;font-size:13px;color:#666;line-height:1.8;">
        • 입금자명은 <strong style="color:#333;">신청자 본인 이름</strong>으로 부탁드립니다.<br>
        • 입금 확인 후 카카오톡 또는 메일로 수강 안내를 보내드립니다.<br>
        • 확인까지 최대 1 영업일 소요될 수 있습니다.
      </div>

      <div style="text-align:center;margin:24px 0;">
        <a href="${KAKAO_OPEN_CHAT}" style="display:inline-block;background:#FEE500;color:#191919;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:bold;">카카오톡으로 입금 확인 요청</a>
      </div>

      <p style="color:#999;font-size:12px;line-height:1.6;margin:24px 0 0;">
        문의사항은 <a href="${KAKAO_OPEN_CHAT}" style="color:#D4756E;">카카오톡 오픈채팅</a>으로 부탁드립니다.
      </p>`,
    ),
  })
}

/** 신규 수강 신청 → 관리자 알림 */
export async function sendEnrollmentToAdmin(
  payload: Payload,
  enrollment: { id: number | string; name: string; email: string; phone?: string | null; program?: string | null; message?: string | null },
) {
  await payload.sendEmail({
    to: adminEmail(),
    subject: `[AI놀자 알림] 📩 새 수강 신청 — ${enrollment.name} (${enrollment.program || '미지정'})`,
    html: wrap(
      '📩 새 수강 신청이 접수되었습니다',
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">이름</td><td><strong style="color:#333;">${enrollment.name}</strong></td></tr>
        <tr><td style="color:#999;">이메일</td><td>${enrollment.email}</td></tr>
        <tr><td style="color:#999;">연락처</td><td>${enrollment.phone || '-'}</td></tr>
        <tr><td style="color:#999;">프로그램</td><td><strong style="color:#D4756E;">${enrollment.program || '-'}</strong></td></tr>
        ${enrollment.message ? `<tr><td style="color:#999;vertical-align:top;">문의사항</td><td style="color:#333;">${enrollment.message}</td></tr>` : ''}
      </table>
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/admin/collections/enrollments/${enrollment.id}" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">신청 상세 보기</a>
      </div>`,
    ),
  })
}

/** 신규 주문 접수 → 관리자 알림 */
export async function sendOrderCreatedToAdmin(
  payload: Payload,
  order: { id: number | string; orderNumber: string; buyerName?: string | null; buyerEmail: string; buyerPhone?: string | null; productName: string; amount?: number | null; status?: string | null },
) {
  await payload.sendEmail({
    to: adminEmail(),
    subject: `[AI놀자 알림] 새 주문 ${order.orderNumber}`,
    html: wrap(
      '🆕 새 주문이 접수되었습니다',
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">주문번호</td><td>${order.orderNumber}</td></tr>
        <tr><td style="color:#999;">상품</td><td><strong style="color:#333;">${order.productName}</strong></td></tr>
        <tr><td style="color:#999;">금액</td><td><strong style="color:#D4756E;">${priceKR(order.amount || 0)}</strong></td></tr>
        <tr><td style="color:#999;">구매자</td><td>${order.buyerName || '-'}</td></tr>
        <tr><td style="color:#999;">이메일</td><td>${order.buyerEmail}</td></tr>
        <tr><td style="color:#999;">연락처</td><td>${order.buyerPhone || '-'}</td></tr>
        <tr><td style="color:#999;">상태</td><td>${order.status || 'pending'}</td></tr>
      </table>
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/admin/collections/orders/${order.id}" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">주문 상세 보기</a>
      </div>`,
    ),
  })
}

/** 결제 완료 → 관리자 알림 */
export async function sendPaymentCompletedToAdmin(
  payload: Payload,
  order: { id: number | string; orderNumber: string; buyerName?: string | null; buyerEmail: string; productName: string; amount?: number | null },
) {
  await payload.sendEmail({
    to: adminEmail(),
    subject: `[AI놀자 알림] 💰 결제 완료 ${order.orderNumber}`,
    html: wrap(
      '💰 결제가 완료되었습니다',
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">주문번호</td><td>${order.orderNumber}</td></tr>
        <tr><td style="color:#999;">상품</td><td><strong style="color:#333;">${order.productName}</strong></td></tr>
        <tr><td style="color:#999;">금액</td><td><strong style="color:#10B981;">${priceKR(order.amount || 0)}</strong></td></tr>
        <tr><td style="color:#999;">구매자</td><td>${order.buyerName || '-'} (${order.buyerEmail})</td></tr>
      </table>
      <p style="color:#666;font-size:13px;line-height:1.6;margin:0;">
        ✓ 구매자에게 자동으로 수강 안내 메일이 발송되었습니다.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/admin/collections/orders/${order.id}" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">주문 상세 보기</a>
      </div>`,
    ),
  })
}

/** 환불 요청 → 관리자 알림 */
export async function sendRefundRequestedToAdmin(
  payload: Payload,
  order: { id: number | string; orderNumber: string; buyerName?: string | null; buyerEmail: string; productName: string; amount?: number | null; refundReason?: string | null },
) {
  await payload.sendEmail({
    to: adminEmail(),
    subject: `[AI놀자 알림] 🚨 환불 요청 ${order.orderNumber}`,
    html: wrap(
      '🚨 환불 요청이 들어왔습니다',
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">주문번호</td><td>${order.orderNumber}</td></tr>
        <tr><td style="color:#999;">상품</td><td>${order.productName}</td></tr>
        <tr><td style="color:#999;">금액</td><td><strong style="color:#D4756E;">${priceKR(order.amount || 0)}</strong></td></tr>
        <tr><td style="color:#999;">구매자</td><td>${order.buyerName || '-'} (${order.buyerEmail})</td></tr>
        <tr><td style="color:#999;vertical-align:top;">사유</td><td style="color:#333;">${order.refundReason || '(사유 미입력)'}</td></tr>
      </table>
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/admin/collections/orders/${order.id}" style="display:inline-block;background:#EF4444;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">처리하러 가기</a>
      </div>`,
    ),
  })
}
