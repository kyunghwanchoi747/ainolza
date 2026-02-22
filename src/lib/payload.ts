import { getPayload as getPayloadLocal, Payload } from 'payload'
import config from '@payload-config'

interface CachedPayload {
  instance: Payload | null
  promise: Promise<Payload> | null
}

let cached: CachedPayload = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { instance: null, promise: null }
}

export const getPayload = async () => {
  const start = Date.now()
  if (cached.instance) {
    return cached.instance
  }

  if (!cached.promise) {
    console.log('[Payload] Starting initialization...')
    cached.promise = getPayloadLocal({ config })
  }

  try {
    cached.instance = await cached.promise
    console.log(`[Payload] Initialized in ${Date.now() - start}ms`)
  } catch (e) {
    console.error(`[Payload] Initialization failed after ${Date.now() - start}ms`, e)
    cached.promise = null
    throw e
  }

  return cached.instance
}
