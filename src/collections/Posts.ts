import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Column', value: 'column' },
        { label: 'Insight', value: 'insight' },
      ],
      defaultValue: 'column',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      defaultValue: () => new Date(),
    },
  ],
}
