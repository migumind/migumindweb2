import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({
      name: 'portrait',
      title: 'Opening photograph',
      type: 'image',
      options: {hotspot: true},
      description: 'The large photograph at the top of the home page.',
    }),
    defineField({
      name: 'portraitAlt',
      title: 'Photograph description',
      type: 'string',
      description: 'Read aloud by screen readers. Describe what is in the photo.',
    }),
    defineField({
      name: 'portraitCaption',
      title: 'Photograph caption',
      type: 'string',
      description: 'Small print shown under the photograph.',
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
    select: {media: 'portrait'},
    prepare({media}) {
      return {title: 'Home page', media}
    },
  },
})
