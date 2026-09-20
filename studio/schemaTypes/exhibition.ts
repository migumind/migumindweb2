import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'exhibition',
  title: 'Exhibition',
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
      name: 'number',
      type: 'string',
      description: 'Two-digit label shown beside the title, e.g. 01',
    }),
    defineField({
      name: 'accent',
      type: 'string',
      description: 'Accent colour for this exhibition.',
      options: {
        list: [
          {title: 'Vermilion', value: 'var(--vermilion)'},
          {title: 'Lavender', value: 'var(--lavender)'},
          {title: 'Cobalt', value: 'var(--cobalt)'},
          {title: 'Forest', value: 'var(--forest)'},
          {title: 'Mustard', value: 'var(--mustard)'},
          {title: 'Fluor', value: 'var(--fluor)'},
          {title: 'Sage', value: 'var(--sage)'},
        ],
      },
      initialValue: 'var(--vermilion)',
    }),
    defineField({
      name: 'bandText',
      title: 'Band text colour',
      type: 'string',
      description: 'Use light text when the accent colour is dark, e.g. cobalt or forest.',
      options: {
        list: [
          {title: 'Dark text', value: 'dark'},
          {title: 'Light text', value: 'light'},
        ],
      },
      initialValue: 'dark',
    }),
    defineField({name: 'year', type: 'string', description: 'Shown in listings, e.g. 2026'}),
    defineField({
      name: 'dates',
      type: 'string',
      description: 'Full run, shown on the exhibition page, e.g. 12 MAR — 30 APR 2026',
    }),
    defineField({name: 'location', type: 'string'}),
    defineField({
      name: 'collaborators',
      type: 'string',
      description: 'Shown as "with ...", e.g. Honour & Jett Stanton',
    }),
    defineField({
      name: 'statement',
      type: 'array',
      of: [{type: 'block'}],
      description: 'The exhibition statement, shown beside the hero image.',
    }),
    defineField({name: 'heroImage', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'installationImages',
      title: 'Installation shots',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Lower numbers appear first.',
    }),
  ],
  orderings: [{title: 'Listed order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'location', media: 'heroImage'}},
})
