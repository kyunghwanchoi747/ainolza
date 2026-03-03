import { getPayload as getPayloadInstance } from 'payload'
import config from '@payload-config'

// Cached payload instance for server-side usage
// Avoids re-initialization on each API call
export async function getPayloadClient() {
  return getPayloadInstance({ config })
}
