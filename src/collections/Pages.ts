import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: '콘텐츠',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => (user as any)?.userType === 'admin',
    update: ({ req: { user } }) => (user as any)?.userType === 'admin',
    delete: ({ req: { user } }) => (user as any)?.userType === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: '페이지 제목' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL 경로',
      admin: { description: '예: about, landing-2024 (영문, 하이픈 허용)' },
    },
    {
      name: 'status',
      type: 'select',
      label: '상태',
      options: [
        { label: '초안', value: 'draft' },
        { label: '게시됨', value: 'published' },
      ],
      defaultValue: 'draft',
    },
    { name: 'seoTitle', type: 'text', label: 'SEO 제목' },
    { name: 'seoDescription', type: 'textarea', label: 'SEO 설명' },
    { name: 'seoKeywords', type: 'text', label: 'SEO 키워드' },
    {
      name: 'puckData',
      type: 'json',
      label: '페이지 구성 데이터 (Puck)',
      admin: { description: '디자인 모드에서 자동으로 관리됩니다.' },
    },
  ],
}
