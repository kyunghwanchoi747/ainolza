import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'streamId',
      type: 'text',
      label: 'Cloudflare Stream ID',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
  ],
}
