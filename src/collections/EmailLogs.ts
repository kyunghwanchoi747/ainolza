import type { CollectionConfig } from 'payload'

export const EmailLogs: CollectionConfig = {
  slug: 'email_logs',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['to', 'subject', 'type', 'status', 'createdAt'],
    listSearchableFields: ['to', 'subject', 'type'],
  },
  access: {
    // admin만 조회 가능
    read: ({ req: { user } }) => {
      if (!user) return false
      return (user as { role?: string }).role === 'admin'
    },
    // 코드에서만 생성 (admin UI 생성 불필요)
    create: () => true,
    update: () => false,
    delete: ({ req: { user } }) => {
      if (!user) return false
      return (user as { role?: string }).role === 'admin'
    },
  },
  fields: [
    { name: 'to', type: 'text', required: true, label: '수신자' },
    { name: 'subject', type: 'text', required: true, label: '제목' },
    {
      name: 'type',
      type: 'select',
      label: '유형',
      options: [
        { label: '환영 메일', value: 'welcome' },
        { label: '가입 알림 (관리자)', value: 'signup-admin' },
        { label: '수강신청 알림 (관리자)', value: 'enrollment-admin' },
        { label: '수강신청 계좌안내', value: 'enrollment-buyer' },
        { label: '주문 접수 (관리자)', value: 'order-admin' },
        { label: '결제완료 (관리자)', value: 'payment-admin' },
        { label: '결제완료 수강안내', value: 'payment-buyer' },
        { label: '환불요청 (관리자)', value: 'refund-request-admin' },
        { label: '환불완료', value: 'refund-buyer' },
        { label: '기타', value: 'other' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: '상태',
      defaultValue: 'sent',
      options: [
        { label: '발송 완료', value: 'sent' },
        { label: '발송 실패', value: 'failed' },
      ],
    },
    { name: 'error', type: 'text', label: '에러 메시지 (실패 시)' },
    { name: 'relatedId', type: 'text', label: '관련 ID (주문번호/회원ID 등)' },
  ],
}
