import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    group: '브랜드 운영',
    useAsTitle: 'title',
    defaultColumns: ['type', 'title', 'isRead', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => (user as any)?.userType === 'admin',
    create: () => true,
    update: ({ req: { user } }) => (user as any)?.userType === 'admin',
    delete: ({ req: { user } }) => (user as any)?.userType === 'admin',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      label: '알림 유형',
      options: [
        { label: '회원가입', value: 'user_signup' },
        { label: '신규 주문', value: 'new_order' },
        { label: '신규 문의', value: 'new_inquiry' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: '제목',
    },
    {
      name: 'body',
      type: 'text',
      label: '내용',
    },
    {
      name: 'isRead',
      type: 'checkbox',
      label: '읽음',
      defaultValue: false,
    },
    {
      name: 'relatedId',
      type: 'text',
      label: '관련 ID',
    },
    {
      name: 'href',
      type: 'text',
      label: '링크',
    },
  ],
}
