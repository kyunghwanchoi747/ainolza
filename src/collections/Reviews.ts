import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['user', 'product', 'rating', 'status', 'createdAt'],
  },
  access: {
    // 누구나 승인된 후기 읽기 가능
    read: () => true,
    // 로그인한 사용자만 작성
    create: ({ req: { user } }) => !!user,
    // 본인 또는 admin만 수정
    update: ({ req: { user } }) => {
      if (!user) return false
      if ((user as { role?: string }).role === 'admin') return true
      return { user: { equals: user.id } }
    },
    // admin만 삭제
    delete: ({ req: { user } }) => {
      if (!user) return false
      return (user as { role?: string }).role === 'admin'
    },
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: false,
      label: '상품 (선택)',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: '작성자',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: '별점 (1~5)',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: '후기 내용',
    },
    {
      name: 'siteUrl',
      type: 'text',
      label: '내 사이트 URL (선택)',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'approved',
      label: '상태',
      options: [
        { label: '대기 (승인 전)', value: 'pending' },
        { label: '승인됨', value: 'approved' },
        { label: '거부됨', value: 'rejected' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: '노출 순서 (낮을수록 앞에 표시)',
      defaultValue: 0,
    },
  ],
}
