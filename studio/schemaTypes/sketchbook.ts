import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'sketchbook',
  title: 'Sketchbook',
  type: 'document',
  description: 'A batch of sketches. Drag in as many images at once as you like.',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Optional. Leave blank and the date is used instead.',
    }),
    defineField({
      name: 'date',
      type: 'date',
      description: 'Optional. Used for ordering and as a fallback label.',
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: 'sheets',
      title: 'Sketches',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'caption', type: 'string'})],
        }),
      ],
      options: {layout: 'grid'},
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', date: 'date', media: 'sheets.0', sheets: 'sheets'},
    prepare({title, date, media, sheets}) {
      const count = Array.isArray(sheets) ? sheets.length : 0
      return {
        title: title || date || 'Untitled sketchbook',
        subtitle: `${count} ${count === 1 ? 'sketch' : 'sketches'}`,
        media,
      }
    },
  },
})
