import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { ko } from '@payloadcms/translations/languages/ko'
import { en } from '@payloadcms/translations/languages/en'

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
import { SiteStats } from './collections/SiteStats'
import { Hero } from './globals/Hero'
import { MainNav } from './globals/MainNav'

import { Products } from './collections/Products'
import { Reviews } from './collections/Reviews'
import { Notifications } from './collections/Notifications'
import { Pages } from './collections/Pages'
import { SEOSettings } from './globals/SEOSettings'
import { PaymentSettings } from './globals/PaymentSettings'
import { ShopSettings } from './globals/ShopSettings'
import { MessageSettings } from './globals/MessageSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

const isCLI = process.argv.some((value) => {
  const r = realpath(value)
  return r && r.endsWith(path.join('payload', 'bin.js'))
})
const isProduction = process.env.NODE_ENV === 'production'

console.log('--- Initializing Payload Config ---')
console.log('isCLI:', isCLI)
console.log('isProduction:', isProduction)

let cloudflare: CloudflareContext

if (isCLI || !isProduction) {
  const globalAny: any = global
  if (!globalAny.cloudflare) {
    try {
      console.log('[Payload] Fetching Cloudflare Context from Wrangler...')
      const start = Date.now()
      globalAny.cloudflare = await getCloudflareContextFromWrangler()
      console.log(`[Payload] Cloudflare Context fetched in ${Date.now() - start}ms`)
    } catch (err) {
      console.error('FAILED to fetch Cloudflare Context from Wrangler:', err)
      globalAny.cloudflare = { env: {} }
    }
  }
  cloudflare = globalAny.cloudflare
} else {
  try {
    cloudflare = await getCloudflareContext({ async: true })
  } catch (err) {
    console.error('FAILED to fetch Production Cloudflare Context:', err)
    cloudflare = { env: {} } as any
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        Dashboard: {
          Component: './components/Admin/Dashboard#Dashboard',
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    Products,
    Reviews,
    Orders,
    Programs,
    Courses,
    Posts,
    CommunityPosts,
    Comments,
    Categories,
    Inquiries,
    SiteStats,
    Notifications,
    Pages,
  ],
  globals: [Hero, MainNav, ShopSettings, SEOSettings, PaymentSettings, MessageSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE_FOR_DEV',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: cloudflare?.env?.D1 || ({} as any),
    push: false,
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
  i18n: {
    supportedLanguages: { ko, en },
  },
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
