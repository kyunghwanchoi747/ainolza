import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    group: '브랜드 운영',
    defaultColumns: ['id', 'customer', 'status', 'amount', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') {
        return {
          customer: {
            equals: user.id,
          },
        }
      }
      return true
    },
    update: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      label: '주문번호',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: '주문자',
    },
    {
      name: 'items',
      type: 'array',
      label: '주문 품목',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: ['products', 'programs', 'courses'] as any,
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: '주문 상태',
      options: [
        { label: '결제대기', value: 'pending' },
        { label: '결제완료', value: 'paid' },
        { label: '배송준비중', value: 'preparing' },
        { label: '배송중', value: 'shipping' },
        { label: '배송완료', value: 'delivered' },
        { label: '주문취소', value: 'cancelled' },
        { label: '반품/교환', value: 'returned' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      label: '최종 결제 금액',
      required: true,
    },
    {
      name: 'shippingInfo',
      type: 'group',
      label: '배송 정보',
      fields: [
        {
          name: 'receiverName',
          type: 'text',
          label: '수령인',
        },
        {
          name: 'receiverPhone',
          type: 'text',
          label: '연락처',
        },
        {
          name: 'address',
          type: 'text',
          label: '주소',
        },
        {
          name: 'memo',
          type: 'text',
          label: '배송 메모',
        },
        {
          name: 'trackingNumber',
          type: 'text',
          label: '운송장 번호',
        },
      ],
    },
    {
      name: 'paymentInfo',
      type: 'group',
      label: '결제 정보',
      fields: [
        {
          name: 'method',
          type: 'select',
          options: [
            { label: '신용카드', value: 'card' },
            { label: '가상계좌', value: 'vbank' },
            { label: '계좌이체', value: 'trans' },
            { label: '삼성페이', value: 'samsungpay' },
            { label: '카카오페이', value: 'kakaopay' },
          ],
        },
        {
          name: 'transactionID',
          type: 'text',
          label: 'PG 거래 아이디',
        },
      ],
    },
  ],
}
