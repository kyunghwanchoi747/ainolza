import type { CollectionConfig } from 'payload'

export const DesignPages: CollectionConfig = {
  slug: 'design-pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'projectData',
      type: 'json',
    },
    {
      name: 'html',
      type: 'textarea',
    },
    {
      name: 'css',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    },
  ],
}
