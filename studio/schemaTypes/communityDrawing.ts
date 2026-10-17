import {defineField, defineType} from 'sanity'

// A drawing someone made on the contact page's pixel pad and emailed in, shown as a
// stamp in the community gallery. The drawing itself is the code in the emailed
// link (…/contact/drawing/#1abc…), so there is no image to upload.

const CODE = /1[0-9ab]{256}$/

export default defineType({
  name: 'communityDrawing',
  title: 'Community drawing',
  type: 'document',
  fields: [
    defineField({
      name: 'drawing',
      title: 'Drawing link',
      type: 'string',
      description: 'Paste the whole drawing link from the email (it ends in a long # code).',
      validation: (r) =>
        r.required().custom((v) => (v && CODE.test(v.trim()) ? true : "That link doesn't hold a full drawing. It may have been cut off.")),
    }),
    defineField({
      name: 'name',
      title: 'Credit as',
      type: 'string',
      description: 'How the sender would like to be credited: first name, handle, or leave empty for no name. Only publish with their OK.',
      validation: (r) => r.max(32),
    }),
    defineField({
      name: 'received',
      title: 'Received',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'from',
      title: 'From (place)',
      type: 'string',
      description: 'Optional, e.g. "Manila" or "Brunswick". Printed like a postmark.',
      validation: (r) => r.max(24),
    }),
  ],
  orderings: [{title: 'Newest', name: 'receivedDesc', by: [{field: 'received', direction: 'desc'}]}],
  preview: {
    select: {name: 'name', received: 'received'},
    prepare: ({name, received}) => ({title: name || 'No name', subtitle: received}),
  },
})
