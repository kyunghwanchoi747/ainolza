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
      collection: 'email_logs' as any,
      data: { recipient: data.to, subject: data.subject, type: data.type, status: data.status || 'sent', error: data.error, relatedId: data.relatedId },
    })
  } catch {
    // 로그 저장 실패는 무시
  }
}

function priceKR(amount?: number): string {
  if (!amount) return '0원'
  return amount.toLocaleString('ko-KR') + '원'
}

// AI놀자 디자인 시스템 톤을 그대로 메일에 적용.
//  ink #1a1a1a (제목/강조 텍스트)
//  sub #888888 (보조 텍스트)
//  line #dddddd (구분선)
//  surface #fafafa (배경 박스)
//  brand #D4756E (헤더 워드마크 + CTA 버튼만)
// 이모지 사용 금지(디자인 룰).
const wrap = (title: string, bodyHtml: string) => `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border:1px solid #dddddd;border-radius:16px;padding:48px 40px;">
        <tr><td>
          <div style="margin-bottom:28px;">
            <h1 style="color:#D4756E;font-size:18px;font-weight:bold;margin:0;letter-spacing:0.04em;">AI놀자</h1>
          </div>
          <h2 style="color:#1a1a1a;font-size:22px;font-weight:bold;margin:0 0 20px;line-height:1.4;letter-spacing:-0.01em;">${title}</h2>
          ${bodyHtml}
          <hr style="border:none;border-top:1px solid #dddddd;margin:36px 0 16px;">
          <p style="color:#888888;font-size:11px;margin:0;">AI놀자 · info@ainolza.kr</p>
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
    subject: '[AI놀자] 가입을 환영합니다',
    html: wrap(
      `${name}님, 환영합니다`,
      `
      <p style="color:#888888;font-size:15px;line-height:1.7;margin:0 0 16px;">
        AI놀자에 가입해 주셔서 감사합니다.
      </p>
      <p style="color:#888888;font-size:14px;line-height:1.7;margin:0 0 24px;">
        AI놀자는 평범한 사람을 위한 AI 활용 강의와 도구를 만드는 공간입니다.
        강의·전자책 구매부터 AI 도구 활용까지 다양한 콘텐츠를 만나보세요.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${SITE_URL}/store" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">강의/책 보러가기</a>
      </div>
      <p style="color:#888888;font-size:12px;line-height:1.6;margin:28px 0 0;">
        궁금한 점이 있으시면 <a href="${KAKAO_OPEN_CHAT}" style="color:#D4756E;text-decoration:none;font-weight:bold;">카카오톡 문의</a>로 연락주세요.
      </p>`,
    ),
  })
}

/** 결제 완료 → 사용자에게 안내 (상품 유형별 분기) */
export async function sendPaymentCompletedToBuyer(
  payload: Payload,
  order: {
    orderNumber: string
    buyerName?: string | null
    buyerEmail: string
    productName: string
    productType?: string | null
    productSlug?: string | null
    amount?: number | null
    classrooms?: string[] | null
    shippingRecipient?: string | null
    shippingAddress?: string | null
    shippingAddressDetail?: string | null
    shippingZipcode?: string | null
  },
) {
  const name = order.buyerName || order.buyerEmail.split('@')[0]
  const productType = (order.productType || '').toLowerCase()
  const hasClassroom = Array.isArray(order.classrooms) && order.classrooms.length > 0

  // 전자책 — 마이페이지 안내로 통일 (직접 링크 미발송, 매 다운로드 시 인증 검증)
  let ebookDownloadHtml = ''
  if (productType === 'ebook') {
    ebookDownloadHtml = `
      <h3 style="color:#1a1a1a;font-size:15px;font-weight:bold;margin:28px 0 10px;">전자책 다운로드 안내</h3>
      <p style="color:#888888;font-size:14px;line-height:1.7;margin:0 0 16px;">
        마이페이지에서 전자책을 다운로드 받으실 수 있습니다.
        <strong style="color:#1a1a1a;">로그인된 본인 계정에서만</strong> 다운로드 가능합니다.
      </p>
      <div style="border-top:1px solid #dddddd;border-bottom:1px solid #dddddd;padding:14px 0;margin:0 0 24px;">
        <p style="color:#1a1a1a;font-size:13px;font-weight:bold;margin:0 0 6px;">저작권 보호 안내</p>
        <p style="color:#888888;font-size:12px;line-height:1.7;margin:0;">
          본 전자책의 무단 복제·배포·공유·전송은 「저작권법」 제136조에 따라
          5년 이하의 징역 또는 5천만원 이하의 벌금에 처해질 수 있습니다.
        </p>
      </div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:bold;">마이페이지에서 다운로드</a>
      </div>`
  }

  // 종이책 — 배송 안내
  let bookShippingHtml = ''
  if (productType === 'book' && order.shippingAddress) {
    bookShippingHtml = `
      <h3 style="color:#1a1a1a;font-size:15px;font-weight:bold;margin:28px 0 10px;">배송 안내</h3>
      <p style="color:#888888;font-size:14px;line-height:1.7;margin:0 0 16px;">
        영업일 기준 2~3일 내에 발송됩니다. 운송장 번호가 등록되면 마이페이지에서 확인하실 수 있습니다.
      </p>
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#888888;">
        <tr><td style="width:90px;color:#888888;">받는 사람</td><td style="color:#1a1a1a;">${order.shippingRecipient || ''}</td></tr>
        <tr><td style="color:#888888;">주소</td><td style="color:#1a1a1a;">(${order.shippingZipcode || ''}) ${order.shippingAddress} ${order.shippingAddressDetail || ''}</td></tr>
      </table>
      <div style="text-align:center;margin:28px 0;">
        <a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">배송 현황 확인</a>
      </div>`
  }

  // 강의 — 강의실 입장 안내
  let classroomHtml = ''
  if (hasClassroom) {
    classroomHtml = `
      <h3 style="color:#1a1a1a;font-size:15px;font-weight:bold;margin:28px 0 10px;">수강 시작하기</h3>
      <p style="color:#888888;font-size:14px;line-height:1.7;margin:0 0 24px;">
        마이페이지의 <strong style="color:#1a1a1a;">"내 강의실"</strong>에서 강의를 시청하실 수 있습니다.
        영상은 회차별로 정리되어 있으며, 각 회차마다 노션 가이드북이 함께 제공됩니다.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">내 강의실로 이동</a>
      </div>`
  }

  // 어떤 안내도 없으면 기본 마이페이지 안내
  const detailHtml = ebookDownloadHtml || bookShippingHtml || classroomHtml || `
    <p style="color:#888888;font-size:14px;line-height:1.7;margin:0 0 16px;">
      마이페이지에서 주문 내역을 확인하실 수 있습니다.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">마이페이지</a>
    </div>`

  await payload.sendEmail({
    to: order.buyerEmail,
    subject: '[AI놀자] 결제가 완료되었습니다',
    html: wrap(
      `${name}님, 결제가 완료되었습니다`,
      `
      <p style="color:#888888;font-size:15px;line-height:1.7;margin:0 0 20px;">
        주문해 주셔서 감사합니다. 결제가 정상 처리되었습니다.
      </p>
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#888888;">
        <tr><td style="width:90px;color:#888888;">주문번호</td><td style="color:#1a1a1a;font-family:monospace;">${order.orderNumber}</td></tr>
        <tr><td style="color:#888888;">상품</td><td><strong style="color:#1a1a1a;">${order.productName}</strong></td></tr>
        <tr><td style="color:#888888;">결제금액</td><td><strong style="color:#1a1a1a;">${priceKR(order.amount || 0)}</strong></td></tr>
      </table>
      ${detailHtml}
      <p style="color:#888888;font-size:12px;line-height:1.6;margin:28px 0 0;">
        문의사항은 <a href="${KAKAO_OPEN_CHAT}" style="color:#D4756E;text-decoration:none;font-weight:bold;">카카오톡 오픈채팅</a>으로 부탁드립니다.
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

/** 수강 기간 만료 → 사용자에게 안내 */
export async function sendEnrollmentCompletedToBuyer(
  payload: Payload,
  order: { orderNumber: string; buyerName?: string | null; buyerEmail: string; productName: string; paidAt?: string | null },
) {
  const name = order.buyerName || order.buyerEmail.split('@')[0]
  const paidDate = order.paidAt ? new Date(order.paidAt).toLocaleDateString('ko-KR') : '(날짜 정보 없음)'
  await payload.sendEmail({
    to: order.buyerEmail,
    subject: '[AI놀자] 수강 기간이 만료되었습니다',
    html: wrap(
      `${name}님, 수강 기간이 만료되었습니다`,
      `
      <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 20px;">
        100일간의 수강 기간이 만료되었습니다. 강의 시청 감사합니다.
      </p>
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">주문번호</td><td style="font-family:monospace;">${order.orderNumber}</td></tr>
        <tr><td style="color:#999;">상품</td><td><strong style="color:#1a1a1a;">${order.productName}</strong></td></tr>
        <tr><td style="color:#999;">결제일</td><td>${paidDate}</td></tr>
      </table>
      <p style="color:#666;font-size:14px;line-height:1.7;margin:0 0 24px;">
        강의 영상과 자료에 더 이상 접근할 수 없습니다.<br>
        다음 기수 모집이나 추가 자료 구매에 관심이 있으시면 문의해 주세요.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${SITE_URL}/store" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">다른 강의 보러가기</a>
      </div>
      <p style="color:#999;font-size:12px;line-height:1.6;margin:24px 0 0;">
        문의사항은 <a href="${KAKAO_OPEN_CHAT}" style="color:#D4756E;">카카오톡 오픈채팅</a>으로 부탁드립니다.
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
        <tr><td style="color:#888888;font-weight:bold;width:160px;">단톡방 입장 링크</td><td><a href="https://open.kakao.com/o/gbmc0ppi" style="color:#D4756E;font-weight:bold;text-decoration:none;">https://open.kakao.com/o/gbmc0ppi</a></td></tr>
        <tr><td style="color:#888888;font-weight:bold;">참여 코드(비밀번호)</td><td><strong style="font-size:18px;color:#1a1a1a;">nolza232</strong></td></tr>
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
    subject: `[AI놀자 알림] 새 회원 가입 — ${user.email}`,
    html: wrap(
      '새 회원이 가입했습니다',
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#888888;">
        <tr><td style="width:90px;color:#888888;">이메일</td><td><strong style="color:#1a1a1a;">${user.email}</strong></td></tr>
        <tr><td style="color:#888888;">이름</td><td style="color:#1a1a1a;">${user.name || '-'}</td></tr>
        <tr><td style="color:#888888;">연락처</td><td style="color:#1a1a1a;">${user.phone || '-'}</td></tr>
        <tr><td style="color:#888888;">가입경로</td><td style="color:#1a1a1a;">${provider}</td></tr>
      </table>
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/admin/collections/users/${user.id}" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">회원 상세 보기</a>
      </div>`,
    ),
  })
}

/** 수강 신청/주문 접수 → 신청자에게 결제 안내 메일 (단순 알림) */
export async function sendEnrollmentConfirmToBuyer(
  payload: Payload,
  enrollment: { name: string; email: string; program?: string | null },
  product?: { title?: string; price?: number; originalPrice?: number } | null,
) {
  const name = enrollment.name || enrollment.email.split('@')[0]
  const programTitle = product?.title || enrollment.program || '강의'
  await payload.sendEmail({
    to: enrollment.email,
    subject: '[AI놀자] 신청이 접수되었습니다 — 결제 후 신청이 확정됩니다',
    html: wrap(
      `${name}님, 신청이 접수되었습니다`,
      `
      <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 16px;">
        <strong>${programTitle}</strong> 신청이 정상 접수되었습니다.
      </p>

      <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 20px;">
        <strong style="color:#D4756E;">결제를 완료해야 신청이 확정됩니다.</strong> 아직 결제 전이시라면 사이트에서 결제를 진행해 주세요.
      </p>

      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:bold;">마이페이지에서 확인하기</a>
      </div>

      <p style="color:#999;font-size:12px;line-height:1.6;margin:24px 0 0;">
        문의사항은 <a href="https://open.kakao.com/o/s7kkWTfh" style="color:#D4756E;">카카오톡 오픈채팅</a>으로 부탁드립니다.
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
    subject: `[AI놀자 알림] 새 수강 신청 — ${enrollment.name} (${enrollment.program || '미지정'})`,
    html: wrap(
      '새 수강 신청이 접수되었습니다',
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#888888;">
        <tr><td style="width:90px;color:#888888;">이름</td><td><strong style="color:#1a1a1a;">${enrollment.name}</strong></td></tr>
        <tr><td style="color:#888888;">이메일</td><td style="color:#1a1a1a;">${enrollment.email}</td></tr>
        <tr><td style="color:#888888;">연락처</td><td style="color:#1a1a1a;">${enrollment.phone || '-'}</td></tr>
        <tr><td style="color:#888888;">프로그램</td><td><strong style="color:#1a1a1a;">${enrollment.program || '-'}</strong></td></tr>
        ${enrollment.message ? `<tr><td style="color:#888888;vertical-align:top;">문의사항</td><td style="color:#1a1a1a;">${enrollment.message}</td></tr>` : ''}
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
  order: { id: number | string; orderNumber: string; buyerName?: string | null; buyerEmail: string; buyerPhone?: string | null; productName: string; amount?: number | null; status?: string | null; pgProvider?: string | null; payMethod?: string | null; depositorName?: string | null; cashReceiptType?: string | null; cashReceiptNumber?: string | null },
) {
  const isDirectBank = order.pgProvider === 'direct-bank'
  const depositorName = order.depositorName || order.buyerName || '(미설정)'
  const hasCashReceipt =
    (order.cashReceiptType === 'income' || order.cashReceiptType === 'expense') &&
    !!order.cashReceiptNumber
  const subject = isDirectBank
    ? `[AI놀자 알림] 무통장 입금 대기 ${order.orderNumber}`
    : `[AI놀자 알림] 새 주문 ${order.orderNumber}`
  const heading = isDirectBank
    ? '무통장 입금 대기 주문이 접수되었습니다'
    : '새 주문이 접수되었습니다'

  await payload.sendEmail({
    to: adminEmail(),
    subject,
    html: wrap(
      heading,
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">주문번호</td><td>${order.orderNumber}</td></tr>
        <tr><td style="color:#999;">상품</td><td><strong style="color:#333;">${order.productName}</strong></td></tr>
        <tr><td style="color:#999;">금액</td><td><strong style="color:#333;">${priceKR(order.amount || 0)}</strong></td></tr>
        <tr><td style="color:#999;">구매자</td><td>${order.buyerName || '-'}</td></tr>
        <tr><td style="color:#999;">이메일</td><td>${order.buyerEmail}</td></tr>
        <tr><td style="color:#999;">연락처</td><td>${order.buyerPhone || '-'}</td></tr>
        <tr><td style="color:#999;">상태</td><td>${order.status || 'pending'}</td></tr>
      </table>
      ${
        isDirectBank
          ? `
      <div style="border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding:14px 0;margin:0 0 24px;">
        <div style="font-weight:bold;color:#333;margin-bottom:8px;">무통장 입금 확인 필요</div>
        <table cellpadding="4" cellspacing="0" style="font-size:13px;color:#555;">
          <tr><td style="width:90px;color:#999;">입금자명</td><td><strong style="color:#333;font-size:15px;">${depositorName}</strong></td></tr>
          <tr><td style="color:#999;">입금 계좌</td><td>토스뱅크 1000-1041-3507 (최경환)</td></tr>
          <tr><td style="color:#999;">마감</td><td>주문일시로부터 24시간</td></tr>
        </table>
        <div style="margin-top:8px;font-size:12px;color:#888;">
          입금 확인 후 어드민에서 [입금확인] 버튼을 눌러 처리해 주세요.
        </div>
      </div>`
          : ''
      }
      ${
        hasCashReceipt
          ? `
      <div style="border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding:14px 0;margin:0 0 24px;">
        <div style="font-weight:bold;color:#333;margin-bottom:8px;">현금영수증 발급 요청</div>
        <table cellpadding="4" cellspacing="0" style="font-size:13px;color:#555;">
          <tr><td style="width:90px;color:#999;">유형</td><td><strong>${order.cashReceiptType === 'income' ? '개인소득공제용' : '사업자지출증빙용(세금계산서 대용)'}</strong></td></tr>
          <tr><td style="color:#999;">번호</td><td><strong style="font-family:monospace;">${order.cashReceiptNumber}</strong></td></tr>
        </table>
        <div style="margin-top:8px;font-size:12px;color:#888;">
          입금 확인 후 홈택스 또는 PortOne에서 발급해 주세요.
        </div>
      </div>`
          : ''
      }
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/admin/collections/orders/${order.id}" style="display:inline-block;background:#333;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">주문 상세 보기</a>
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
    subject: `[AI놀자 알림] 결제 완료 ${order.orderNumber}`,
    html: wrap(
      '결제가 완료되었습니다',
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#888888;">
        <tr><td style="width:90px;color:#888888;">주문번호</td><td style="color:#1a1a1a;font-family:monospace;">${order.orderNumber}</td></tr>
        <tr><td style="color:#888888;">상품</td><td><strong style="color:#1a1a1a;">${order.productName}</strong></td></tr>
        <tr><td style="color:#888888;">금액</td><td><strong style="color:#1a1a1a;">${priceKR(order.amount || 0)}</strong></td></tr>
        <tr><td style="color:#888888;">구매자</td><td style="color:#1a1a1a;">${order.buyerName || '-'} (${order.buyerEmail})</td></tr>
      </table>
      <p style="color:#888888;font-size:13px;line-height:1.6;margin:0 0 24px;">
        구매자에게 자동으로 수강 안내 메일이 발송되었습니다.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${SITE_URL}/admin/collections/orders/${order.id}" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">주문 상세 보기</a>
      </div>`,
    ),
  })
}

/** 환불 요청 → 관리자 알림 */
export async function sendRefundRequestedToAdmin(
  payload: Payload,
  order: {
    id: number | string
    orderNumber: string
    buyerName?: string | null
    buyerEmail: string
    productName: string
    amount?: number | null
    refundReason?: string | null
    pgProvider?: string | null
    refundBank?: string | null
    refundAccountNum?: string | null
    refundAccountHolder?: string | null
  },
) {
  const isDirectBank = order.pgProvider === 'direct-bank'
  await payload.sendEmail({
    to: adminEmail(),
    subject: `[AI놀자 알림] 환불 요청 ${order.orderNumber}`,
    html: wrap(
      '환불 요청이 들어왔습니다',
      `
      <table cellpadding="6" cellspacing="0" style="width:100%;background:#fafafa;border-radius:10px;padding:8px;margin:0 0 24px;font-size:13px;color:#666;">
        <tr><td style="width:90px;color:#999;">주문번호</td><td>${order.orderNumber}</td></tr>
        <tr><td style="color:#999;">상품</td><td>${order.productName}</td></tr>
        <tr><td style="color:#999;">금액</td><td><strong style="color:#333;">${priceKR(order.amount || 0)}</strong></td></tr>
        <tr><td style="color:#999;">구매자</td><td>${order.buyerName || '-'} (${order.buyerEmail})</td></tr>
        <tr><td style="color:#999;vertical-align:top;">사유</td><td style="color:#333;">${order.refundReason || '(사유 미입력)'}</td></tr>
      </table>
      ${
        isDirectBank
          ? `
      <div style="border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding:14px 0;margin:0 0 24px;">
        <div style="font-weight:bold;color:#333;margin-bottom:8px;">무통장 환불 — 송금할 계좌</div>
        <table cellpadding="4" cellspacing="0" style="font-size:13px;color:#555;">
          <tr><td style="color:#999;width:90px;">은행</td><td><strong>${order.refundBank || '-'}</strong></td></tr>
          <tr><td style="color:#999;">계좌번호</td><td><strong style="font-family:monospace;">${order.refundAccountNum || '-'}</strong></td></tr>
          <tr><td style="color:#999;">예금주</td><td><strong>${order.refundAccountHolder || '-'}</strong></td></tr>
        </table>
        <div style="margin-top:8px;font-size:12px;color:#888;">
          어드민에서 [환불 승인] 후 위 계좌로 직접 송금해 주세요.
        </div>
      </div>`
          : ''
      }
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/admin/collections/orders/${order.id}" style="display:inline-block;background:#333;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:bold;">처리하러 가기</a>
      </div>`,
    ),
  })
}

/** 가상계좌(무통장입금) 발급 → 구매자에게 입금 안내 메일 */
export async function sendVirtualAccountIssued(
  payload: Payload,
  order: {
    orderNumber?: string
    buyerName?: string
    buyerEmail?: string
    productName?: string
    amount?: number | null
    vbankName?: string | null
    vbankNum?: string | null
    vbankDate?: string | Date | null
  },
) {
  if (!order.buyerEmail) return
  const expiry = order.vbankDate
    ? new Date(order.vbankDate).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''
  const name = order.buyerName || order.buyerEmail.split('@')[0]
  await payload.sendEmail({
    to: order.buyerEmail,
    subject: `[AI놀자] 가상계좌 발급 완료 — 입금 후 신청이 확정됩니다`,
    html: wrap(
      `${name}님, 가상계좌가 발급되었습니다`,
      `
      <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 16px;">
        <strong>${order.productName || '주문'}</strong> 결제를 위한 가상계좌가 발급되었습니다.<br>
        아래 계좌로 입금해 주시면 자동으로 결제가 완료되어 신청이 확정됩니다.
      </p>

      <table cellpadding="8" cellspacing="0" style="width:100%;background:#FFF1F0;border:2px solid #D4756E;border-radius:12px;margin:0 0 20px;font-size:14px;color:#333;">
        <tr><td style="width:90px;color:#888;font-weight:bold;">은행</td><td><strong>${order.vbankName || '-'}</strong></td></tr>
        <tr><td style="color:#888;font-weight:bold;">계좌번호</td><td><strong style="font-size:18px;color:#1a1a1a;letter-spacing:0.5px;">${order.vbankNum || '-'}</strong></td></tr>
        <tr><td style="color:#888;font-weight:bold;">입금금액</td><td><strong style="font-size:18px;color:#D4756E;">${priceKR(order.amount || 0)}</strong></td></tr>
        ${expiry ? `<tr><td style="color:#888;font-weight:bold;">입금기한</td><td style="color:#D4756E;"><strong>${expiry}</strong> 까지</td></tr>` : ''}
        ${order.orderNumber ? `<tr><td style="color:#888;font-weight:bold;">주문번호</td><td style="font-family:monospace;color:#666;">${order.orderNumber}</td></tr>` : ''}
      </table>

      <div style="background:#fafafa;border-radius:10px;padding:14px 16px;margin:0 0 24px;font-size:13px;color:#666;line-height:1.8;">
        • 입금 확인은 자동으로 처리되며 보통 <strong style="color:#333;">1~5분 이내</strong>에 완료됩니다.<br>
        • 입금기한이 지나면 가상계좌가 자동으로 만료되어 입금되지 않습니다.<br>
        • 다른 사람 명의로 입금하셔도 결제는 정상 처리되지만, 입금자명이 신청자 본인 이름과 같으면 확인이 빠릅니다.
      </div>

      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:bold;">마이페이지에서 확인하기</a>
      </div>

      <p style="color:#999;font-size:12px;line-height:1.6;margin:24px 0 0;">
        문의사항은 <a href="${KAKAO_OPEN_CHAT}" style="color:#D4756E;">카카오톡 오픈채팅</a>으로 부탁드립니다.
      </p>`,
    ),
  })
}

// ==========================================
// 대기 신청 (Waitlist)
// ==========================================

/** 대기 신청 접수 — 신청자에게 발송 */
export async function sendWaitlistReceived(
  payload: Payload,
  data: { buyerEmail: string; buyerName: string; productName: string },
) {
  const subject = `[AI놀자] ${data.productName} 대기 신청이 접수되었습니다`
  try {
    await payload.sendEmail({
      to: data.buyerEmail,
      subject,
      html: wrap(
        `${data.buyerName}님, 대기 신청이 접수되었습니다`,
        `
        <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 16px;">
          신청해주셔서 감사합니다. <strong style="color:#1a1a1a;">${data.productName}</strong>
          다음 기수 모집이 시작되면 가장 먼저 안내드리겠습니다.
        </p>
        <p style="color:#444444;font-size:14px;line-height:1.7;margin:0 0 24px;">
          모집 일정과 가격은 변동될 수 있습니다. 일정이 확정되는 즉시 이 이메일 주소로 안내 메일을 보내드립니다.
        </p>

        <div style="background:#fafafa;border-radius:10px;padding:14px 16px;margin:0 0 24px;font-size:13px;color:#666;line-height:1.8;">
          • 대기 신청은 결제가 아니므로 결제 정보를 받지 않습니다.<br>
          • 안내 메일을 받으신 후 본인이 직접 결제 페이지에서 결제하셔야 수강이 확정됩니다.<br>
          • 대기 순번은 신청 순서를 우선하나, 다음 기수 모집 방식에 따라 달라질 수 있습니다.
        </div>

        <p style="color:#999;font-size:12px;line-height:1.6;margin:24px 0 0;">
          궁금하신 점은 <a href="${KAKAO_OPEN_CHAT}" style="color:#D4756E;">카카오톡 오픈채팅</a>으로 문의해주세요.
        </p>`,
      ),
    })
    await logEmailSent(payload, { to: data.buyerEmail, subject, type: 'other', relatedId: data.productName })
  } catch (e) {
    await logEmailSent(payload, {
      to: data.buyerEmail,
      subject,
      type: 'other',
      status: 'failed',
      error: (e as Error).message,
    })
    throw e
  }
}

/** 대기 신청 접수 — 관리자에게 알림 */
export async function sendWaitlistAdminAlert(
  payload: Payload,
  data: { buyerName: string; buyerEmail: string; buyerPhone?: string; productSlug: string; productName: string; motivation?: string },
) {
  const to = adminEmail()
  const subject = `[AI놀자 운영] 대기 신청 — ${data.productName} (${data.buyerName})`
  try {
    await payload.sendEmail({
      to,
      subject,
      html: wrap(
        `대기 신청이 접수되었습니다`,
        `
        <table cellpadding="6" cellspacing="0" style="width:100%;font-size:14px;color:#444;border-collapse:collapse;margin:0 0 18px;">
          <tr><td style="color:#888;font-weight:bold;width:90px;">상품</td><td>${data.productName} <span style="color:#bbb;">(${data.productSlug})</span></td></tr>
          <tr><td style="color:#888;font-weight:bold;">이름</td><td>${data.buyerName}</td></tr>
          <tr><td style="color:#888;font-weight:bold;">이메일</td><td>${data.buyerEmail}</td></tr>
          ${data.buyerPhone ? `<tr><td style="color:#888;font-weight:bold;">휴대폰</td><td>${data.buyerPhone}</td></tr>` : ''}
          ${data.motivation ? `<tr><td style="color:#888;font-weight:bold;vertical-align:top;">동기</td><td style="white-space:pre-wrap;">${data.motivation}</td></tr>` : ''}
        </table>
        <div style="text-align:center;margin:24px 0;">
          <a href="${SITE_URL}/admin/collections/waitlists" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:bold;">어드민에서 대기 명단 보기</a>
        </div>`,
      ),
    })
    await logEmailSent(payload, { to, subject, type: 'other', relatedId: data.productSlug })
  } catch (e) {
    await logEmailSent(payload, {
      to,
      subject,
      type: 'other',
      status: 'failed',
      error: (e as Error).message,
    })
    // 관리자 메일 실패는 throw 안 함 (사용자 응답 막지 않게)
  }
}
