import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
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
    defineField({name: 'location', type: 'string'}),
    defineField({
      name: 'description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'images',
      title: 'Photographs',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description:
        'Shown as a shuffleable stack. Drag in as many as you like — three or more reads best.',
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Lower numbers appear first.',
    }),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'location', media: 'images.0'}},
})
