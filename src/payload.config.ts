import fs from 'fs'
import path from 'path'
import { buildConfig } from 'payload'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { DesignPages } from './collections/DesignPages'
import { Products } from './collections/Products'
import { ProductCategories } from './collections/ProductCategories'
import { Posts } from './collections/Posts'
import { Comments } from './collections/Comments'
import { Programs } from './collections/Programs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => {
  try { return fs.existsSync(value) ? fs.realpathSync(value) : undefined } catch { return undefined }
}

const isCLI = process.argv.some((value) => {
  const rp = realpath(value)
  return rp ? rp.endsWith(path.join('payload', 'bin.js')) : false
})
const isProduction = process.env.NODE_ENV === 'production'
const isBuildPhase = process.env.BUILD_PHASE === 'true'
const useD1 = !isBuildPhase && (isProduction || isCLI)

let dbAdapter: any

if (useD1) {
  let cloudflare: CloudflareContext
  if (isCLI || !isProduction) {
    const globalAny: any = global
    if (!globalAny.cloudflare) {
      globalAny.cloudflare = await getCloudflareContextFromWrangler()
    }
    cloudflare = globalAny.cloudflare
  } else {
    cloudflare = await getCloudflareContext({ async: true })
  }
  dbAdapter = sqliteD1Adapter({ binding: cloudflare.env.D1 })
} else {
  // Dynamic import to avoid bundling @libsql/client in Workers
  const { sqliteAdapter } = await import(/* webpackIgnore: true */ '@payloadcms/db-sqlite')
  dbAdapter = sqliteAdapter({ client: { url: 'file:./dev.db' } })
}

function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, DesignPages, Products, ProductCategories, Posts, Comments, Programs],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',
  db: dbAdapter,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
