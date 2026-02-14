import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'customer', 'status', 'amount', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') {
        // Admins can see all orders (hypothetically, if we have roles)
        // For now, let's assume auth: true users are customers or admins
        return {
          customer: {
            equals: user.id,
          },
        }
      }
      return true
    },
    // We'll likely have a webhook to update status, but admins can edit
    update: ({ req: { user } }) => {
      // Logic for admin only would go here
      return !!user
    },
    create: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: ['programs', 'courses'],
      hasMany: true,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'paymentID',
      type: 'text',
      admin: {
        description: 'PG transaction ID (e.g., Portone)',
      },
    },
  ],
}
