import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    group: '콘텐츠',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }: any) => user?.id,
    },
    {
      name: 'content',
      type: 'relationship',
      relationTo: ['community-posts', 'courses', 'programs'],
      required: true,
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
