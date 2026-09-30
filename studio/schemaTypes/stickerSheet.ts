import {defineArrayMember, defineField, defineType} from 'sanity'

// The sticker-bomb wall behind the events globe. Empty = the built-in set.
export default defineType({
  name: 'stickerSheet',
  title: 'Event stickers',
  type: 'document',
  fields: [
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
  preview: {prepare: () => ({title: 'Event stickers'})},
})
