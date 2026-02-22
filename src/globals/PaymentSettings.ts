import type { GlobalConfig } from 'payload'

export const PaymentSettings: GlobalConfig = {
  slug: 'payment-settings',
  label: '전자결제(PG)',
  admin: {
    group: '관리',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'provider',
      type: 'select',
      label: 'PG사 선택',
      options: [
        { label: '토스페이먼츠', value: 'toss' },
        { label: 'KG이니시스', value: 'inicis' },
        { label: '포트원 (PortOne)', value: 'portone' },
      ],
    },
    {
      name: 'mid',
      type: 'text',
      label: '상점 아이디 (MID)',
    },
    {
      name: 'apiKey',
      type: 'text',
      label: 'API Secret Key',
    },
    {
      name: 'testMode',
      type: 'checkbox',
      label: '테스트 모드 사용',
      defaultValue: true,
    },
  ],
}
