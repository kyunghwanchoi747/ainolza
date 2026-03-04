import type { CollectionConfig } from 'payload'

export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  admin: {
    useAsTitle: 'siteName',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'AI 놀자',
    },
    {
      name: 'homePath',
      type: 'text',
      defaultValue: '/home',
      admin: {
        description: '홈페이지 URL 경로 (예: /home)',
      },
    },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: '메뉴 표시 이름' },
        },
        {
          name: 'path',
          type: 'text',
          required: true,
          admin: { description: 'URL 경로 (예: /store, /contents)' },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: '홈페이지', value: 'home' },
            { label: '스토어', value: 'store' },
            { label: '커뮤니티', value: 'community' },
            { label: '프로그램', value: 'programs' },
            { label: '커스텀 페이지', value: 'custom' },
          ],
        },
        {
          name: 'customPageSlug',
          type: 'text',
          admin: {
            description: '커스텀 페이지 슬러그 (type이 custom일 때만)',
            condition: (data, siblingData) => siblingData?.type === 'custom',
          },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
}
