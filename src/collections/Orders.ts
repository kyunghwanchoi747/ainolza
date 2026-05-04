import type { CollectionConfig } from 'payload'
import {
  sendOrderCreatedToAdmin,
  sendEnrollmentConfirmToBuyer,
  sendPaymentCompletedToAdmin,
  sendPaymentCompletedToBuyer,
  sendRefundRequestedToAdmin,
  sendRefundCompletedToBuyer,
  sendAdvancedClassGroupChat,
} from '../lib/email-templates'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'buyerName', 'productName', 'amount', 'status', 'createdAt'],
    listSearchableFields: ['orderNumber', 'buyerName', 'buyerEmail', 'buyerPhone', 'productName'],
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, previousDoc, req }): Promise<void> => {
        const d = doc as any
        const oid = d.orderNumber || String(d.id)

        // 각 알림을 개별 try/catch — 하나 실패해도 주문 처리에 영향 없음
        if (operation === 'create') {
          // 관리자 알림
          try { await sendOrderCreatedToAdmin(req.payload, d) } catch (e) { console.error('[ORDER CREATE NOTIFY]', (e as Error).message) }

          // 구매자 입금 안내 메일 (포트원 결제 연동 전까지)
          if (d.buyerEmail) {
            try {
              await sendEnrollmentConfirmToBuyer(
                req.payload,
                { name: d.buyerName || d.buyerEmail.split('@')[0], email: d.buyerEmail },
                { title: d.productName, price: d.amount ?? undefined },
              )
            } catch (e) { console.error('[ORDER CREATE BUYER EMAIL]', (e as Error).message) }
          }
        }

        if (operation === 'update' && previousDoc) {
          const prevStatus = (previousDoc as any).status
          const newStatus = d.status

          // 강의실 권한 변경 시 어드민 알림
          const prevClassrooms: string[] = Array.isArray((previousDoc as any).classrooms) ? (previousDoc as any).classrooms : []
          const newClassrooms: string[] = Array.isArray(d.classrooms) ? d.classrooms : []
          const addedClassrooms = newClassrooms.filter((c: string) => !prevClassrooms.includes(c))
          const removedClassrooms = prevClassrooms.filter((c: string) => !newClassrooms.includes(c))
          if (addedClassrooms.length > 0 || removedClassrooms.length > 0) {
            const adminTo = process.env.ADMIN_EMAIL || 'rex39@naver.com'
            const lines = []
            if (addedClassrooms.length > 0) lines.push(`추가된 강의실: ${addedClassrooms.join(', ')}`)
            if (removedClassrooms.length > 0) lines.push(`제거된 강의실: ${removedClassrooms.join(', ')}`)
            try {
              await req.payload.sendEmail({
                to: adminTo,
                subject: `[AI놀자] 강의실 권한 변경: ${d.buyerName || d.buyerEmail}`,
                html: `<p>주문번호: ${oid}<br>수강생: ${d.buyerName || ''} (${d.buyerEmail})<br>${lines.join('<br>')}</p>`,
              })
            } catch (e) { console.error('[CLASSROOM CHANGE]', (e as Error).message) }
          }

          if (prevStatus === newStatus) return

          if (newStatus === 'paid') {
            try { await sendPaymentCompletedToAdmin(req.payload, d) } catch (e) { console.error('[PAID ADMIN]', (e as Error).message) }
        // try { await logEmailSent(req.payload, { to: 'admin', subject: `결제완료 ${oid}`, type: 'payment-admin', relatedId: oid }) } catch {}  // TODO: 로깅 재활성화
            try { await sendPaymentCompletedToBuyer(req.payload, d) } catch (e) { console.error('[PAID BUYER]', (e as Error).message) }
        // try { await logEmailSent(req.payload, { to: d.buyerEmail, subject: `결제완료 수강안내`, type: 'payment-buyer', relatedId: oid }) } catch {}  // TODO: 로깅 재활성화

            // 심화반 단톡방 안내 (모든 기수: vibe-coding-advanced, vibe-coding-advanced-2, ...)
            const cls = Array.isArray(d.classrooms) ? d.classrooms : []
            if (cls.some((s: string) => typeof s === 'string' && s.startsWith('vibe-coding-advanced'))) {
              try { await sendAdvancedClassGroupChat(req.payload, d) } catch (e) { console.error('[심화반 단톡방]', (e as Error).message) }
        // try { await logEmailSent(req.payload, { to: d.buyerEmail, subject: '심화반 단톡방 안내', type: 'other', relatedId: oid }) } catch {}  // TODO: 로깅 재활성화
            }
          }

          if (newStatus === 'refund_requested') {
            try { await sendRefundRequestedToAdmin(req.payload, d) } catch (e) { console.error('[REFUND REQ]', (e as Error).message) }
        // try { await logEmailSent(req.payload, { to: 'admin', subject: `환불요청 ${oid}`, type: 'refund-request-admin', relatedId: oid }) } catch {}  // TODO: 로깅 재활성화
          }

          if (newStatus === 'refunded') {
            try { await sendRefundCompletedToBuyer(req.payload, d) } catch (e) { console.error('[REFUNDED]', (e as Error).message) }
        // try { await logEmailSent(req.payload, { to: d.buyerEmail, subject: `환불완료`, type: 'refund-buyer', relatedId: oid }) } catch {}  // TODO: 로깅 재활성화
          }
        }
      },
    ],
  },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, label: '주문번호' },
    { name: 'buyerName', type: 'text', required: true, label: '구매자' },
    { name: 'buyerEmail', type: 'email', required: true, label: '이메일' },
    { name: 'buyerPhone', type: 'text', label: '연락처' },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: '회원',
      required: false, // 사용자 삭제 시 NULL로 설정 가능
    },
    { name: 'productName', type: 'text', required: true, label: '상품명' },
    { name: 'productSlug', type: 'text', label: '상품 슬러그' },
    {
      name: 'productType',
      type: 'select',
      label: '상품 유형',
      options: [
        { label: '강의', value: 'class' },
        { label: '전자책', value: 'ebook' },
        { label: '종이책', value: 'book' },
        { label: '번들', value: 'bundle' },
      ],
    },
    { name: 'amount', type: 'number', required: true, label: '결제금액' },
    { name: 'originalAmount', type: 'number', label: '정가' },
    {
      name: 'payMethod',
      type: 'select',
      label: '결제수단',
      options: [
        { label: '카드', value: 'card' },
        { label: '가상계좌', value: 'vbank' },
        { label: '계좌이체', value: 'trans' },
        { label: '휴대폰', value: 'phone' },
        { label: '카카오페이', value: 'kakaopay' },
        { label: '네이버페이', value: 'naverpay' },
        { label: '토스페이', value: 'tosspay' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: '주문상태',
      defaultValue: 'pending',
      options: [
        { label: '주문접수', value: 'pending' },
        { label: '결제완료', value: 'paid' },
        { label: '이용중', value: 'active' },
        { label: '완료', value: 'completed' },
        { label: '환불요청', value: 'refund_requested' },
        { label: '환불완료', value: 'refunded' },
        { label: '결제실패', value: 'failed' },
        { label: '주문취소', value: 'cancelled' },
      ],
    },
    // PortOne 연동 필드
    { name: 'impUid', type: 'text', label: 'PortOne imp_uid' },
    { name: 'merchantUid', type: 'text', label: 'Merchant UID' },
    { name: 'pgProvider', type: 'text', label: 'PG사' },
    { name: 'receiptUrl', type: 'text', label: '영수증 URL' },
    // 가상계좌
    { name: 'vbankName', type: 'text', label: '가상계좌 은행' },
    { name: 'vbankNum', type: 'text', label: '가상계좌 번호' },
    { name: 'vbankDate', type: 'date', label: '입금기한' },
    // 환불
    { name: 'refundReason', type: 'textarea', label: '환불 사유' },
    { name: 'refundedAt', type: 'date', label: '환불일' },
    { name: 'refundAmount', type: 'number', label: '환불금액' },
    // 현금영수증
    {
      name: 'cashReceiptType',
      type: 'select',
      label: '현금영수증',
      options: [
        { label: '미발행', value: 'none' },
        { label: '소득공제용', value: 'income' },
        { label: '지출증빙용', value: 'expense' },
      ],
      defaultValue: 'none',
    },
    { name: 'cashReceiptNumber', type: 'text', label: '현금영수증 번호' },
    // 배송 (종이책)
    { name: 'shippingRecipient', type: 'text', label: '받는 사람' },
    { name: 'shippingPhone', type: 'text', label: '연락처' },
    { name: 'shippingZipcode', type: 'text', label: '우편번호' },
    { name: 'shippingAddress', type: 'text', label: '주소' },
    { name: 'shippingAddressDetail', type: 'text', label: '상세 주소' },
    { name: 'shippingMessage', type: 'textarea', label: '배송 메시지' },
    {
      name: 'shippingStatus',
      type: 'select',
      label: '배송 상태',
      options: [
        { label: '미발송', value: 'pending' },
        { label: '발송 준비중', value: 'preparing' },
        { label: '배송중', value: 'shipping' },
        { label: '배송완료', value: 'delivered' },
      ],
    },
    { name: 'trackingNumber', type: 'text', label: '운송장 번호' },
    { name: 'shippingCarrier', type: 'text', label: '택배사' },
    // 메모
    { name: 'adminMemo', type: 'textarea', label: '관리자 메모' },
    // 강의실 / 도서 액세스 권한 (다중 선택)
    // NOTE: 새 기수 추가 시 여기 옵션을 함께 추가해야 함. Payload select는
    // 정의되지 않은 값이 들어오면 검증 거부. 향후 4기까지 미리 등록해둠.
    {
      name: 'classrooms',
      type: 'select',
      hasMany: true,
      label: '강의실',
      options: [
        // 1기
        { label: '바이브 코딩 101 (입문) — 1기', value: 'vibe-coding-101' },
        { label: '바이브 코딩 심화 — 1기', value: 'vibe-coding-advanced' },
        // 2기
        { label: '바이브 코딩 101 (입문) — 2기', value: 'vibe-coding-101-2' },
        { label: '바이브 코딩 심화 — 2기', value: 'vibe-coding-advanced-2' },
        // 3기
        { label: '바이브 코딩 101 (입문) — 3기', value: 'vibe-coding-101-3' },
        { label: '바이브 코딩 심화 — 3기', value: 'vibe-coding-advanced-3' },
        // 4기
        { label: '바이브 코딩 101 (입문) — 4기', value: 'vibe-coding-101-4' },
        { label: '바이브 코딩 심화 — 4기', value: 'vibe-coding-advanced-4' },
      ],
    },
    {
      name: 'books',
      type: 'select',
      hasMany: true,
      label: '도서',
      options: [
        { label: '퍼스널 인텔리젠스', value: 'personal-intelligence' },
        { label: '불편한 AI', value: 'uncomfortable-ai' },
        { label: 'AI시대의 15가지 프롬프트 전략', value: 'prompt-15' },
        { label: 'NotebookLM 학습용 프롬프트 가이드', value: 'notebooklm-guide' },
      ],
    },
  ],
}
