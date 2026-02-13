import type { CollectionConfig } from 'payload'

export const CommunityPosts: CollectionConfig = {
  slug: 'community-posts',
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
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}
