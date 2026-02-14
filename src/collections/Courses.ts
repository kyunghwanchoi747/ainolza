import type { CollectionConfig, FieldAccess } from 'payload'

const checkHasPurchase: FieldAccess = async ({ req: { user, payload }, id }) => {
  if (!user || !id) return false
  
  const targetId = typeof id === 'string' ? parseInt(id, 10) : id

  const orders = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { customer: { equals: user.id } },
        { status: { equals: 'paid' } },
        { items: { contains: targetId } }
      ]
    }
  })

  return orders.totalDocs > 0
}

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Metadata is public
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
      access: {
        read: checkHasPurchase
      }
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Duration',
    },
    {
      name: 'level',
      type: 'select',
      label: 'Level',
      options: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
  ],
}
