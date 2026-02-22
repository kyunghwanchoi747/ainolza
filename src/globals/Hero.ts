import type { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: '홈 화면 설정',
  admin: {
    group: '관리',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '메인 히어로',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: '메인 제목',
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: '서브 제목',
            },
            {
              name: 'primaryButton',
              type: 'group',
              label: '기본 버튼',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: '버튼 텍스트',
                },
                {
                  name: 'link',
                  type: 'text',
                  label: '버튼 링크',
                },
              ],
            },
            {
              name: 'secondaryButton',
              type: 'group',
              label: '보조 버튼',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: '버튼 텍스트',
                },
                {
                  name: 'link',
                  type: 'text',
                  label: '버튼 링크',
                },
              ],
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: '배경 이미지',
            },
          ],
        },
        {
          label: '통계 대시보드',
          fields: [
            {
              name: 'stats',
              type: 'array',
              label: '통계 아이템',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: '아이콘 (Lucide)',
                },
              ],
            },
          ],
        },
        {
          label: 'CTA 섹션',
          fields: [
            {
              name: 'ctaTitle',
              type: 'text',
              label: 'CTA 제목',
            },
            {
              name: 'ctaSubtitle',
              type: 'textarea',
              label: 'CTA 설명',
            },
            {
              name: 'ctaButton',
              type: 'group',
              label: 'CTA 버튼',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                },
                {
                  name: 'link',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
