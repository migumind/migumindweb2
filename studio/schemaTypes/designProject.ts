import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'designProject',
  title: 'Design project',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: ['POSTER SERIES', 'VISUAL IDENTITY', 'APPAREL', 'CREATIVE DIRECTION'],
      },
    }),
    defineField({name: 'year', type: 'string'}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
  ],
  preview: {select: {title: 'title', subtitle: 'category', media: 'image'}},
})
