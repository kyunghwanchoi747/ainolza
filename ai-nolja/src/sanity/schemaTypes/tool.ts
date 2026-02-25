import { defineField, defineType } from 'sanity'

export const tool = defineType({
    name: 'tool',
    title: 'Tool',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'link',
            title: 'Link',
            type: 'url',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
        }),
    ],
})
