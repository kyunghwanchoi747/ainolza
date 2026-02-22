import type { GlobalConfig } from 'payload'

export const MainNav: GlobalConfig = {
  slug: 'main-nav',
  label: '메뉴 설정',
  admin: {
    group: '관리',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Rocket', value: 'Rocket' },
            { label: 'ShoppingBag', value: 'ShoppingBag' },
            { label: 'BookOpen', value: 'BookOpen' },
            { label: 'MessageSquare', value: 'MessageSquare' },
            { label: 'HelpCircle', value: 'HelpCircle' },
          ],
        },
      ],
    },
  ],
}
