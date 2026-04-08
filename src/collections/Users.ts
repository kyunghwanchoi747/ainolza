import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '이름',
    },
    {
      name: 'phone',
      type: 'text',
      label: '연락처',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
    },
    {
      name: 'mustResetPassword',
      type: 'checkbox',
      label: '첫 로그인 시 비밀번호 재설정 필수',
      defaultValue: false,
    },
    {
      name: 'importedFrom',
      type: 'text',
      label: '이전 출처',
    },
    {
      name: 'googleId',
      type: 'text',
      label: '구글 ID',
      index: true,
    },
    {
      name: 'kakaoId',
      type: 'text',
      label: '카카오 ID',
      index: true,
    },
    {
      name: 'naverId',
      type: 'text',
      label: '네이버 ID',
      index: true,
    },
  ],
}
