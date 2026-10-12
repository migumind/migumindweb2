import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({
      name: 'track',
      title: 'Music track (song 1)',
      type: 'file',
      options: {accept: 'audio/*'},
      description:
        'Upload the audio here to unlock the real visualiser and the HPF/LPF filter. Without it the player falls back to the SoundCloud embed, where only volume can be controlled.',
    }),
    defineField({
      name: 'trackTitle',
      title: 'Now playing (song 1)',
      type: 'string',
      description:
        'Scrolls across the record player while the music plays, e.g. "Nap King Cole — 110 / No More". Leave empty to use the file name (or the SoundCloud title).',
    }),
    defineField({
      name: 'tracks',
      title: 'More songs',
      type: 'array',
      description:
        'Songs that play after song 1, in this order; the player loops back to the start after the last. Visitors can skip with the arrows on the player.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'song',
          fields: [
            defineField({name: 'file', title: 'Audio', type: 'file', options: {accept: 'audio/*'}, validation: (r) => r.required()}),
            defineField({name: 'title', title: 'Now playing', type: 'string', description: 'Leave empty to use the file name.'}),
          ],
          preview: {select: {title: 'title', subtitle: 'file.asset.originalFilename'}},
        }),
      ],
    }),
    defineField({
      name: 'introVideo',
      title: 'Intro video',
      type: 'file',
      options: {accept: 'video/*'},
      description:
        'Landscape video running full width behind the opening text. Plays silently on a loop. Keep it short and compressed — every visitor downloads the whole file, on phone data too.',
    }),
    defineField({
      name: 'introPoster',
      title: 'Intro still',
      type: 'image',
      options: {hotspot: true},
      description:
        'Shown while the video loads, and instead of it on slow connections. Use a frame from the video.',
    }),
    defineField({
      name: 'heroSlides',
      title: 'Opening gallery',
      type: 'array',
      description:
        'One or more slides at the top of the home page. Add a single slide for a still opener, or two or three to make it swipeable.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'slide',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              options: {hotspot: true},
              description: 'Also the poster frame if you add a video.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'video',
              title: 'Video (optional)',
              type: 'file',
              options: {accept: 'video/*'},
              description: 'Plays silently on a loop in place of the image. Keep it short and small.',
            }),
            defineField({
              name: 'alt',
              title: 'Description',
              type: 'string',
              description: 'Read aloud by screen readers. Describe what is shown.',
            }),
            defineField({name: 'caption', type: 'string'}),
          ],
          preview: {select: {title: 'alt', subtitle: 'caption', media: 'image'}},
        }),
      ],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'statementHeading',
      type: 'string',
      initialValue: 'Painting, print and design are one practice',
    }),
    defineField({
      name: 'statement',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Two to four sentences. The only long text on the home page.',
    }),
  ],
  preview: {
    select: {media: 'heroSlides.0.image'},
    prepare({media}) {
      return {title: 'Home page', media}
    },
  },
})
