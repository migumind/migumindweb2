import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'year', type: 'string'}),
    defineField({
      name: 'medium',
      type: 'string',
      description: 'Shown uppercase, e.g. ACRYLIC / OIL / CANVAS',
    }),
    defineField({name: 'dimensions', type: 'string'}),
    defineField({
      name: 'description',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Shown on the artwork page, under the details.',
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Sold', value: 'sold'},
          {title: 'Private collection', value: 'private'},
          {title: 'Commissioned', value: 'commissioned'},
          {title: 'Not for sale', value: 'nfs'},
        ],
      },
      initialValue: 'available',
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          {title: 'Paintings', value: 'paintings'},
          {title: 'Drawings', value: 'drawings'},
          {title: 'Prints', value: 'prints'},
          {title: 'Commissions', value: 'commissions'},
          {title: 'Live work', value: 'live'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'gridWidth',
      title: 'Grid width',
      type: 'number',
      description: 'How many columns the card spans in the archive grid.',
      options: {
        list: [
          {title: 'Narrow (4)', value: 4},
          {title: 'Medium (6)', value: 6},
          {title: 'Wide (8)', value: 8},
        ],
      },
      initialValue: 4,
    }),
    defineField({name: 'exhibition', type: 'reference', to: [{type: 'exhibition'}]}),
    defineField({
      name: 'studioEntries',
      title: 'Related studio entries',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'studioEntry'}]}],
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Lower numbers appear first in the archive.',
    }),
  ],
  orderings: [
    {title: 'Archive order', name: 'order', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'medium', media: 'image'}},
})
