import { type SchemaTypeDefinition } from 'sanity'
import { lecture } from './lecture'
import { tool } from './tool'
import { hero } from './hero'
import { page } from './page'
import { siteSettings } from './siteSettings'
import { product } from './product'
import { post } from './post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [lecture, tool, hero, page, siteSettings, product, post],
}
