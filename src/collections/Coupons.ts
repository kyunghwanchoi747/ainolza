import type { CollectionConfig } from 'payload'

/**
 * Coupons — 할인 쿠폰.
 *
 * 발급 트리거:
 *  - 파트너스 추천 링크(`?ref=CODE`)로 진입한 회원에게 자동 발급
 *  - 향후: 1기 우대, 생일 쿠폰 등 마케팅 캠페인용으로 재사용 가능
 *
 * 사용:
 *  - 결제 페이지에서 본인 쿠폰 목록 조회 → 한 장 선택 → 결제
 *  - 1회용. 결제 완료 시 redeemedAt 기록.
 *  - 결제 환불 시 쿠폰 복원은 안 함 (정책 단순화).
 */
export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'user', 'discountPercent', 'status', 'redeemedAt', 'createdAt'],
    listSearchableFields: ['code'],
  },
  access: {
    // 본인 쿠폰만 보이게 — 비공개
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'admin') return true
      return { user: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: '쿠폰 코드 (랜덤)',
      admin: { description: '발급 시 자동 생성. 사용자가 직접 입력하지 않음.' },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      label: '소유 회원',
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      defaultValue: 'percent',
      label: '할인 유형',
      options: [
        { label: '정률 할인 (%)', value: 'percent' },
        { label: '정액 할인 (원)', value: 'amount' },
      ],
    },
    {
      name: 'discountPercent',
      type: 'number',
      label: '할인율 (%) — discountType=percent일 때',
      min: 1,
      max: 99,
    },
    {
      name: 'discountAmount',
      type: 'number',
      label: '할인 금액 (원) — discountType=amount일 때',
      min: 1,
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'referral',
      label: '발급 출처',
      options: [
        { label: '파트너스 추천', value: 'referral' },
        { label: '관리자 직접 발급', value: 'admin' },
        { label: '캠페인', value: 'campaign' },
      ],
    },
    {
      name: 'referralCode',
      type: 'text',
      label: '관련 추천 코드 (source=referral일 때)',
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: '상태',
      options: [
        { label: '사용 가능', value: 'active' },
        { label: '사용 완료', value: 'redeemed' },
        { label: '만료', value: 'expired' },
        { label: '취소', value: 'cancelled' },
      ],
    },
    { name: 'expiresAt', type: 'date', label: '만료일' },
    { name: 'redeemedAt', type: 'date', label: '사용 일시' },
    { name: 'redeemedOrderNumber', type: 'text', label: '사용된 주문번호' },
    { name: 'memo', type: 'textarea', label: '관리자 메모' },
  ],
  timestamps: true,
}
