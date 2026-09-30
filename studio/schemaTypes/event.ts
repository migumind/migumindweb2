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
    defineField({name: 'date', type: 'date', group: 'main'}),
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
      description: 'How the event name is drawn, streetwear-badge style. Leave empty to pick one automatically.',
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'main',
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
      name: 'order',
      type: 'number',
      description: 'Lower numbers appear first.',
      group: 'main',
    }),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'location', media: 'images.0'}},
})
