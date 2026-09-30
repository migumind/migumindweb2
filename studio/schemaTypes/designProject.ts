import {defineArrayMember, defineField, defineType} from 'sanity'

// Graphic design commissions, listed on /design under the portfolio.
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
    defineField({name: 'client', type: 'string', description: 'Who the work was for.'}),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: ['POSTER SERIES', 'VISUAL IDENTITY', 'APPAREL', 'CREATIVE DIRECTION', 'ILLUSTRATION', 'PACKAGING'],
      },
    }),
    defineField({name: 'year', type: 'string'}),
    defineField({
      name: 'image',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'description',
      title: 'Brief / description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'gallery',
      title: 'More images',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
      options: {layout: 'grid'},
    }),
    defineField({name: 'link', title: 'External link', type: 'url', description: 'Optional: the live project, client site, etc.'}),
    defineField({name: 'order', type: 'number', description: 'Lower numbers show first. Leave empty to sort by year.'}),
  ],
  orderings: [
    {title: 'Manual order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Year, newest first', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'client', media: 'image'}},
})
