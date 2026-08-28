import type { CollectionConfig } from 'payload'

// 코드(email-templates.ts)의 각 발송 함수와 1:1 매칭되는 key.
// 여기 없는 key는 어드민에서 수정 불가 (HTML 구조 전체를 갈아엎어야 하는 메일은 제외).
export const EMAIL_TEMPLATE_KEYS = [
  { label: '회원가입 환영 메일', value: 'welcome' },
  { label: '결제완료 안내 (구매자)', value: 'payment-completed-buyer' },
  { label: '환불완료 안내 (구매자)', value: 'refund-completed-buyer' },
  { label: '수강기간 만료 안내 (구매자)', value: 'enrollment-completed-buyer' },
  { label: '신청접수 안내 (구매자, 결제 전)', value: 'enrollment-confirm-buyer' },
  { label: '심화반 단톡방 안내', value: 'advanced-class-groupchat' },
  { label: '가상계좌 발급 안내', value: 'vaccount-issued' },
  { label: '가상계좌 입금기한 임박 안내', value: 'vaccount-reminder' },
] as const

export type EmailTemplateKey = (typeof EMAIL_TEMPLATE_KEYS)[number]['value']

const isKey = (key: EmailTemplateKey) => ({ key: { equals: key } })

export const EmailTemplates: CollectionConfig = {
  slug: 'email_templates',
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'subject', 'updatedAt'],
    description:
      '수강신청·결제 시 자동 발송되는 메일의 제목과 주요 문구입니다. 비워두면 기본 문구로 발송됩니다. 표·버튼 등 나머지 구조는 여기서 바꿀 수 없습니다.',
  },
  access: {
    read: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    create: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
  },
  fields: [
    {
      name: 'key',
      type: 'select',
      required: true,
      unique: true,
      label: '어떤 메일인지',
      options: EMAIL_TEMPLATE_KEYS as unknown as { label: string; value: string }[],
    },
    {
      name: 'subject',
      type: 'text',
      label: '메일 제목',
      admin: { description: '비워두면 기본 제목으로 발송됩니다.' },
    },
    {
      name: 'greeting',
      type: 'textarea',
      label: '인사말 / 도입 문구',
      admin: {
        description: '이름은 {{name}}, 상품명은 {{productName}} 으로 표시하면 자동 치환됩니다.',
        condition: (data) =>
          ['welcome', 'payment-completed-buyer', 'refund-completed-buyer', 'enrollment-completed-buyer', 'enrollment-confirm-buyer'].includes(
            data?.key,
          ),
      },
    },
    {
      name: 'closing',
      type: 'textarea',
      label: '마무리 문구',
      admin: {
        description: '문의 안내 등 하단 문구. {{name}} / {{productName}} 치환 가능.',
        condition: (data) =>
          ['welcome', 'refund-completed-buyer', 'enrollment-completed-buyer'].includes(data?.key),
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: '본문 문구',
      admin: {
        description:
          '단톡방 안내·가상계좌 안내처럼 전체 문단을 바꾸는 메일용. 줄바꿈은 그대로 반영됩니다. {{name}} / {{productName}} 치환 가능.',
        condition: (data) => ['advanced-class-groupchat', 'vaccount-issued', 'vaccount-reminder'].includes(data?.key),
      },
    },
  ],
}
