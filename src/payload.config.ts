import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Programs } from './collections/Programs'
import { Courses } from './collections/Courses'
import { CommunityPosts } from './collections/CommunityPosts'
import { Orders } from './collections/Orders'
import { Categories } from './collections/Categories'
import { Comments } from './collections/Comments'
import { Inquiries } from './collections/Inquiries'
import { Hero } from './globals/Hero'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

const isCLI = process.argv.some((value) => realpath(value).endsWith(path.join('payload', 'bin.js')))
const isProduction = process.env.NODE_ENV === 'production'

console.log('--- Initializing Payload Config ---')
console.log('isCLI:', isCLI)
console.log('isProduction:', isProduction)

let cloudflare: CloudflareContext

if (isCLI || !isProduction) {
  const globalAny: any = global
  if (!globalAny.cloudflare) {
    console.log('Fetching Cloudflare Context from Wrangler...')
    globalAny.cloudflare = await getCloudflareContextFromWrangler()
    console.log('Cloudflare Context Fetched.')
  } else {
    console.log('Using Cached Cloudflare Context.')
  }
  cloudflare = globalAny.cloudflare
} else {
  console.log('Using Production Cloudflare Context.')
  cloudflare = await getCloudflareContext({ async: true })
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Posts,
    Programs,
    Courses,
    CommunityPosts,
    Orders,
    Categories,
    Comments,
    Inquiries,
  ],
  globals: [Hero],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE_FOR_DEV',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
  }),
  plugins: [
    /*
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
    seoPlugin({
      collections: ['posts', 'courses', 'programs', 'community-posts', 'categories'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: any) => `AI Nolja - ${doc?.title || 'Home'}`,
      generateDescription: ({ doc }: any) => doc?.description,
    }),
    */
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
