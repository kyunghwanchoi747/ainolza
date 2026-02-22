import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'id',
    group: '브랜드 운영',
    defaultColumns: ['product', 'user', 'rating', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: '작성자',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: ['products', 'programs', 'courses'] as any,
      required: true,
      label: '대상 상품/강의',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      label: '별점',
      min: 1,
      max: 5,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: '리뷰 내용',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: '첨부 이미지',
    },
  ],
}
