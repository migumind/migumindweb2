import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'studioEntry',
  title: 'Studio entry',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'date', type: 'date'}),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: ['PRINTMAKING', 'COLOUR', 'PROCESS', 'STUDIO', 'DRAWING', 'GRAPHIC'],
      },
    }),
    defineField({
      name: 'materials',
      type: 'string',
      description: 'Shown uppercase, e.g. INK / PAPER',
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'category', media: 'image'}},
})
