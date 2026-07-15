import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  // 댓글: 읽기는 누구나, 작성은 로그인 회원, 수정/삭제는 admin만
  // (본인 댓글 수정/삭제가 필요하면 별도 API에서 overrideAccess로 처리)
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
  },
  admin: {
    useAsTitle: 'author',
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      index: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: '승인', value: 'approved' },
        { label: '대기', value: 'pending' },
      ],
      defaultValue: 'approved',
    },
  ],
}
