import type { CollectionConfig } from 'payload'

export const Programs: CollectionConfig = {
  slug: 'programs',
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'version',
      type: 'text',
    },
    {
      name: 'downloadUrl',
      type: 'text',
    },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'Windows', value: 'windows' },
        { label: 'Mac', value: 'mac' },
        { label: 'Linux', value: 'linux' },
        { label: 'Web', value: 'web' },
        { label: '전체', value: 'all' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: '유틸리티', value: 'utility' },
        { label: 'AI 도구', value: 'ai-tool' },
        { label: '플러그인', value: 'plugin' },
        { label: '기타', value: 'other' },
      ],
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
