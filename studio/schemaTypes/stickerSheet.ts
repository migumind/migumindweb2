import {defineArrayMember, defineField, defineType} from 'sanity'

// Settings for the events page: the globe's look and the sticker-bomb wall
// behind it. (Document id stays "stickerSheet" so existing content is kept.)
export default defineType({
  name: 'stickerSheet',
  title: 'Events page',
  type: 'document',
  fields: [
    defineField({
      name: 'globeStyle',
      title: 'Globe map style',
      type: 'string',
      initialValue: 'angular',
      options: {
        layout: 'radio',
        list: [
          {title: 'Angular: low-poly, straight-cut continents', value: 'angular'},
          {title: 'Blocks: pixel-tile continents', value: 'blocks'},
          {title: 'Dots: dot-matrix continents', value: 'dots'},
          {title: 'Detailed: full coastlines', value: 'detailed'},
        ],
      },
    }),
    defineField({
      name: 'globePalette',
      title: 'Globe colours',
      type: 'string',
      initialValue: 'sage',
      options: {
        layout: 'radio',
        list: [
          {title: 'Sage: light green sea, cream land', value: 'sage'},
          {title: 'Paper: cream sea, green land (lightest)', value: 'paper'},
          {title: 'Chrome: silver sea, white land', value: 'chrome'},
          {title: 'Forest: dark green sea, cream land (original)', value: 'forest'},
        ],
      },
    }),
    defineField({
      name: 'stickers',
      type: 'array',
      description:
        'Die-cut stickers scattered behind the globe on the events page. Use PNG or WebP with a transparent background. Leave empty to use the built-in Migumind set; add at least 8 for a full wall.',
      of: [
        defineArrayMember({
          type: 'image',
          fields: [
            defineField({
              name: 'size',
              type: 'number',
              description: 'Relative size, 0.5–2. Default 1.',
              validation: (r) => r.min(0.3).max(3),
            }),
          ],
        }),
      ],
      options: {layout: 'grid'},
    }),
  ],
  preview: {prepare: () => ({title: 'Events page'})},
})
