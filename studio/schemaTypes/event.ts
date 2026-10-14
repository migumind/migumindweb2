import {defineArrayMember, defineField, defineType} from 'sanity'

// Keep in sync with LOGO_STYLES in src/components/EventLogo.astro.
export const LOGO_STYLES = [
  {title: 'Script on yellow oval', value: 'script'},
  {title: 'Striped oval', value: 'stripe'},
  {title: 'Bubble on dotted blue oval', value: 'bubble'},
  {title: 'Property of… (black oval)', value: 'property'},
  {title: 'Chunky cyan, no badge', value: 'pop'},
  {title: 'Varsity script on red oval', value: 'varsity'},
  {title: 'Globe on green oval', value: 'globe'},
  {title: 'Heavy block letters', value: 'block'},
  {title: 'Gothic blackletter in gold (tattoo, halloween)', value: 'gothic'},
  {title: 'Garden: soft lowercase with a bloom', value: 'garden'},
  {title: 'Market flyer: cyan slab on yellow', value: 'market'},
  {title: 'Racing: italic with a chequered flag', value: 'racing'},
  {title: 'Book: serif italic', value: 'book'},
  {title: 'Board: chequerboard frame (chess, mahjong, game nights)', value: 'board'},
]

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    {name: 'main', title: 'Event', default: true},
    {name: 'map', title: 'Map + logo'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required(), group: 'main'}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
      group: 'main',
    }),
    defineField({
      name: 'date',
      type: 'date',
      group: 'main',
      description: 'Events dated today or later show under "Upcoming events" on the home and events pages.',
    }),
    defineField({
      name: 'time',
      type: 'string',
      group: 'main',
      description: 'Optional, shown on upcoming events, e.g. "7pm – late".',
    }),
    defineField({
      name: 'collaborators',
      type: 'array',
      group: 'main',
      description: 'Who it\'s with. Shown on the event as "with @handle" links to their Instagram.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'collaborator',
          fields: [
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'instagram',
              title: 'Instagram handle',
              type: 'string',
              description: 'Without the @, e.g. surplussydney',
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'instagram'}},
        }),
      ],
    }),
    defineField({
      name: 'link',
      title: 'Tickets / RSVP link',
      type: 'url',
      group: 'main',
      description: 'Optional. Upcoming events get a button to it.',
    }),
    defineField({name: 'location', title: 'Venue / location', type: 'string', group: 'main'}),
    defineField({
      name: 'city',
      type: 'string',
      group: ['main', 'map'],
      description:
        'Shown on the globe when pins bunch up. Well-known cities are placed automatically; for anywhere else, fill in Coordinates.',
    }),
    defineField({name: 'country', type: 'string', group: ['main', 'map']}),
    defineField({
      name: 'coordinates',
      type: 'geopoint',
      group: 'map',
      description:
        'Exact pin position. Optional if the city is well known. Tip: right-click a spot in Google Maps to copy its latitude, longitude.',
    }),
    defineField({
      name: 'logoStyle',
      title: 'Title logo style',
      type: 'string',
      group: 'map',
      options: {list: LOGO_STYLES, layout: 'radio'},
      description: 'How the event name is drawn, streetwear-badge style. Leave empty and the title picks one that suits it (a market gets the flyer style, a halloween night goes gothic), or one at random.',
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'main',
    }),
    defineField({
      name: 'poster',
      type: 'image',
      group: 'main',
      description: 'The event poster or flyer. Gets its own section on the event page.',
    }),
    defineField({
      name: 'posterByMigu',
      title: 'I designed this poster',
      type: 'boolean',
      group: 'main',
      initialValue: false,
      description: 'Adds a little "designed by Migu" sticker to the poster.',
      hidden: ({document}) => !document?.poster,
    }),
    defineField({
      name: 'images',
      title: 'Photographs',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
      description:
        'Shown as a shuffleable stack. Drag in as many as you like — three or more reads best.',
      options: {layout: 'grid'},
      group: 'main',
    }),
    defineField({
      name: 'videos',
      type: 'array',
      group: 'main',
      description:
        'Short clips from the night. They play silently on a loop among the photographs. Keep each one small (under ~10 MB).',
      of: [defineArrayMember({type: 'file', options: {accept: 'video/*'}})],
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Lower numbers appear first.',
      group: 'main',
    }),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'location', media: 'images.0'}},
})
