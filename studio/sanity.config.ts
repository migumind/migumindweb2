import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// There is only ever one home page, so it opens straight to the document
// instead of sitting behind a list you could add duplicates to.
const SINGLETONS = ['homePage']

export default defineConfig({
  name: 'migumind',
  title: 'MIGUMIND',
  projectId: 'qp5ck6q0',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home page')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETONS.includes(item.getId() as string),
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {types: schemaTypes},
  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({action}) => action !== 'unpublish' && action !== 'delete' && action !== 'duplicate')
        : input,
  },
})
