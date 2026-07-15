import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  // 공개 콘텐츠: 읽기는 누구나, 쓰기는 admin만
  access: {
    read: () => true,
    create: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: '관리자',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: '자유', value: 'free' },
        { label: '질문', value: 'question' },
        { label: '공유', value: 'share' },
        { label: '공지', value: 'notice' },
      ],
      defaultValue: 'free',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: '임시저장', value: 'draft' },
        { label: '게시', value: 'published' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'pinned',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
