import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'nickname',
      type: 'text',
      unique: true,
      admin: {
        description: '닉네임을 설정해 주세요.',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'notificationSettings',
      type: 'group',
      fields: [
        {
          name: 'comments',
          type: 'checkbox',
          label: '댓글 알림',
          defaultValue: true,
        },
        {
          name: 'marketing',
          type: 'checkbox',
          label: '마케팅 알림',
          defaultValue: false,
        },
      ],
    },
  ],
}
