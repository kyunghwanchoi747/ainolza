import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    group: '브랜드 운영',
    defaultColumns: ['title', 'price', 'stock', 'category', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: '상품명',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: '판매가',
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      label: '재고 수량',
      defaultValue: 0,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: '카테고리',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: '상품 이미지',
    },
    {
      name: 'description',
      type: 'richText',
      label: '상품 상세 설명',
    },
    {
      name: 'status',
      type: 'select',
      label: '판매 상태',
      options: [
        { label: '판매중', value: 'published' },
        { label: '품절', value: 'sold_out' },
        { label: '숨김', value: 'hidden' },
      ],
      defaultValue: 'published',
      required: true,
    },
  ],
}
