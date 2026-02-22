import type { GlobalConfig } from 'payload'

export const SEOSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: '전자결제(PG)',
  admin: {
    group: '관리',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '사이트 제목',
    },
    {
      name: 'description',
      type: 'textarea',
      label: '사이트 설명(Meta Description)',
    },
    {
      name: 'keywords',
      type: 'text',
      label: '검색 키워드',
    },
    {
      name: 'aeo_geo',
      type: 'group',
      label: 'AEO/GEO 최적화',
      fields: [
        {
          name: 'semanticData',
          type: 'textarea',
          label: '시맨틱 구조화 데이터 (JSON-LD)',
        },
        {
          name: 'voiceSearch',
          type: 'checkbox',
          label: '음성 검색 최적화 활성화',
          defaultValue: true,
        },
      ],
    },
  ],
}
