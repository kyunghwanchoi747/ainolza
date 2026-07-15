import type { CollectionConfig } from 'payload'

/**
 * Referrals — 파트너스(어필리에이트) 코드.
 *
 * 1기 수강생이 카톡으로 신청 → 사용자(관리자)가 어드민에서
 * 회원 선택 + 정산 계좌 입력 + 코드 발급. 발급된 코드를 카톡으로 전달.
 *
 * 정책:
 *  - 추천 링크로 들어와 결제 시: 결제자에게 10% 자동 할인
 *  - 결제 완료 후: 추천인에게 결제액의 20% 정산
 *  - 모집 마감 후 일괄 송금. 환불된 건은 제외.
 *  - 연 누적 50만원 초과 시 22% 원천세 차감.
 */
export const Referrals: CollectionConfig = {
  slug: 'referrals',
  // 추천인 정산 정보 보호: 본인 것만 읽기, 쓰기는 admin만
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as { role?: string }).role === 'admin') return true
      return { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'user', 'status', 'totalReferrals', 'totalRewardKrw', 'createdAt'],
    listSearchableFields: ['code'],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: '추천 코드 (영숫자, URL용)',
      admin: { description: '예: CHOI23. 발급 시 자동 생성됨' },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: '추천인 (회원)',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: '상태',
      options: [
        { label: '활성', value: 'active' },
        { label: '중지', value: 'disabled' },
      ],
    },
    // 정산 계좌
    { name: 'payoutBank', type: 'text', label: '정산 은행' },
    { name: 'payoutAccountNum', type: 'text', label: '정산 계좌번호' },
    { name: 'payoutHolder', type: 'text', label: '예금주' },
    // 메모
    { name: 'memo', type: 'textarea', label: '관리자 메모' },
    // 통계용 — 어드민 목록 빠른 표시. 실제 정확한 값은 Orders 조인으로 계산.
    {
      name: 'totalReferrals',
      type: 'number',
      label: '추천 전환 건수 (캐시)',
      defaultValue: 0,
      admin: { description: '집계 시 자동 갱신. 정확한 값은 주문 조회로 산출.' },
    },
    {
      name: 'totalRewardKrw',
      type: 'number',
      label: '누적 보상액 (원, 캐시)',
      defaultValue: 0,
    },
    {
      name: 'paidOutKrw',
      type: 'number',
      label: '지급 완료 금액 (원)',
      defaultValue: 0,
    },
  ],
  timestamps: true,
}
