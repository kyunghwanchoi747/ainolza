import type { GlobalConfig } from 'payload'

export const ShopSettings: GlobalConfig = {
  slug: 'shop-settings',
  label: '쇼핑 설정',
  admin: {
    group: '관리',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'currency',
      type: 'text',
      label: '통화 단위',
      defaultValue: '원',
    },
    {
      name: 'baseShippingFee',
      type: 'number',
      label: '기본 배송비',
      defaultValue: 3000,
    },
    {
      name: 'freeShippingThreshold',
      type: 'number',
      label: '무료 배송 조건 (금액)',
      defaultValue: 50000,
    },
  ],
}
