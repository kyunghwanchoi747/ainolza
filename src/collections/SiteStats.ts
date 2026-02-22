import type { CollectionConfig } from 'payload'

export const SiteStats: CollectionConfig = {
  slug: 'site-stats',
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'visitors', 'pageViews'],
    group: '관리',
  },
  access: {
    read: () => true,
    // Tracking will be done via server-side logic/API
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      unique: true,
      admin: {
        description: 'Statistics date (YYYY-MM-DD)',
      },
    },
    {
      name: 'visitors',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of unique visitors',
      },
    },
    {
      name: 'pageViews',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total page views',
      },
    },
    {
      name: 'newOrders',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of new orders today',
      },
    },
    {
      name: 'revenue',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total revenue today',
      },
    },
  ],
}
