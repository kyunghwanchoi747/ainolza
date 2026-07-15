import type { CollectionConfig } from 'payload'

export const DesignPages: CollectionConfig = {
  slug: 'design-pages',
  // 빌더 내부 데이터: 읽기는 누구나(발행 페이지 렌더용), 쓰기는 admin만
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'projectData',
      type: 'json',
    },
    {
      name: 'html',
      type: 'textarea',
    },
    {
      name: 'css',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    },
  ],
}
