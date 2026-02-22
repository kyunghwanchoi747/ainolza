import type { CollectionConfig } from 'payload'

export const CommunityPosts: CollectionConfig = {
  slug: 'community-posts',
  admin: {
    useAsTitle: 'title',
    group: '콘텐츠',
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
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: '게시물을 상단에 고정합니다',
      },
    },
    {
      name: 'commentsCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: '자동으로 계산됨',
      },
    },
  ],
}
