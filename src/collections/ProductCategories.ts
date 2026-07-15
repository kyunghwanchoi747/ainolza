import type { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  // 공개 콘텐츠: 읽기는 누구나, 쓰기는 admin만
  access: {
    read: () => true,
    create: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
