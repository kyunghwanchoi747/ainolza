import type { CollectionConfig, FieldAccess } from 'payload'

const checkHasPurchase: FieldAccess = async ({ req: { user, payload }, id }) => {
  if (!user || !id) return false
  
  // Convert ID to number if it's a string, as D1 usually uses numbers
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

export const Programs: CollectionConfig = {
  slug: 'programs',
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
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      access: {
        read: checkHasPurchase
      }
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link',
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
  ],
}
