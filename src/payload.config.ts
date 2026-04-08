import fs from 'fs'
import path from 'path'
import { buildConfig } from 'payload'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'

import { workerMailerAdapter } from './lib/email-adapter'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { DesignPages } from './collections/DesignPages'
import { Products } from './collections/Products'
import { ProductCategories } from './collections/ProductCategories'
import { Posts } from './collections/Posts'
import { Comments } from './collections/Comments'
import { Programs } from './collections/Programs'
import { SiteSettings } from './collections/SiteSettings'
import { Enrollments } from './collections/Enrollments'
import { Orders } from './collections/Orders'

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
// BUILD_PHASE는 CI 빌드에서만 의미가 있음
// 워커 런타임에서는 globalThis.caches가 존재하므로 이걸로 빌드 환경을 구분
const isWorkerRuntime = typeof globalThis !== 'undefined' && typeof (globalThis as any).caches !== 'undefined' && typeof (globalThis as any).caches.default !== 'undefined'
const isBuildPhase = process.env.BUILD_PHASE === 'true' && !isWorkerRuntime

let dbAdapter: any

if (isBuildPhase) {
  // CI build phase: use D1 adapter with mock binding.
  // All pages are force-dynamic so no actual DB queries run during build.
  dbAdapter = sqliteD1Adapter({ binding: {} as any })
} else if (isProduction || isWorkerRuntime) {
  // Cloudflare Workers runtime: use real D1 binding
  const cloudflare = await getCloudflareContext({ async: true })
  dbAdapter = sqliteD1Adapter({ binding: cloudflare.env.D1 })
} else if (isCLI) {
  // Payload CLI (migrate, etc): use D1 via wrangler proxy
  const globalAny: any = global
  if (!globalAny.cloudflare) {
    globalAny.cloudflare = await getCloudflareContextFromWrangler()
  }
  dbAdapter = sqliteD1Adapter({ binding: (globalAny.cloudflare as CloudflareContext).env.D1 })
} else {
  // Local dev: use SQLite. Computed string prevents esbuild from resolving this.
  const sqlitePkg = ['@payloadcms', 'db-sqlite'].join('/')
  const { sqliteAdapter } = await import(/* webpackIgnore: true */ sqlitePkg)
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
  collections: [Users, Media, DesignPages, Products, ProductCategories, Posts, Comments, Programs, SiteSettings, Enrollments, Orders],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',
  db: dbAdapter,
  email: workerMailerAdapter,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
