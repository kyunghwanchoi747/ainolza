import type { CollectionConfig } from 'payload'

/**
 * Waitlists — 모집 마감 후 대기 신청자 명단.
 *
 * 운영 흐름:
 *  1. 상품(Products)의 waitlistMode가 true이면 결제 페이지 진입 시 대기 신청 폼으로 분기.
 *  2. 사용자가 신청 → /api/waitlist POST → 이 컬렉션에 행 생성 + 접수 메일 자동 발송.
 *  3. 다음 기수 오픈 시 어드민에서 status='active' 목록 추출 → 일괄 안내 메일.
 *
 * 회원/비회원 모두 가능:
 *  - 로그인 상태면 user 관계 자동 연결 + 이름/이메일/휴대폰 자동 채움.
 *  - 비로그인이어도 신청 가능 (대기자를 더 넓게 받는 게 유리).
 */
export const Waitlists: CollectionConfig = {
  slug: 'waitlists',
  admin: {
    useAsTitle: 'buyerName',
    defaultColumns: ['buyerName', 'buyerEmail', 'productSlug', 'status', 'createdAt'],
    listSearchableFields: ['buyerName', 'buyerEmail', 'buyerPhone'],
    description: '모집 마감 후 대기 신청 명단. 다음 기수 오픈 시 일괄 안내.',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return (user as { role?: string }).role === 'admin'
    },
    create: () => true, // 비회원도 신청 가능
    update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
  },
  fields: [
    {
      name: 'productSlug',
      type: 'text',
      required: true,
      index: true,
      label: '대기 신청 상품 슬러그',
      admin: { description: '예: vibe-coding-101 — 이 슬러그로 모집 알림 발송 대상 추출' },
    },
    {
      name: 'productName',
      type: 'text',
      label: '신청 당시 상품명 (스냅샷)',
    },
    {
      name: 'buyerName',
      type: 'text',
      required: true,
      label: '이름',
    },
    {
      name: 'buyerEmail',
      type: 'email',
      required: true,
      index: true,
      label: '이메일',
    },
    {
      name: 'buyerPhone',
      type: 'text',
      label: '휴대폰',
    },
    {
      name: 'motivation',
      type: 'textarea',
      label: '신청 동기 (선택)',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: '연결된 회원 (로그인 신청 시)',
      admin: { description: '비로그인 신청은 비어있음' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: '상태',
      options: [
        { label: '대기중', value: 'active' },
        { label: '안내 완료', value: 'notified' },
        { label: '결제 완료(전환됨)', value: 'converted' },
        { label: '취소/철회', value: 'cancelled' },
      ],
    },
    {
      name: 'notifiedAt',
      type: 'date',
      label: '안내 메일 발송 일시',
    },
    {
      name: 'source',
      type: 'text',
      label: '유입 경로 (선택)',
      admin: { description: '예: 인스타·블로그·검색 등 — 추후 마케팅 분석용' },
    },
    {
      name: 'adminMemo',
      type: 'textarea',
      label: '관리자 메모',
    },
  ],
  timestamps: true,
}
