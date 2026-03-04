import { getPayloadClient } from '@/lib/payload'
import { SettingsClient } from '@/components/manager/settings-client'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  let settings = null

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'site-settings' as any,
      limit: 1,
    })
    settings = result.docs[0] || null
  } catch {
    // DB not ready
  }

  return <SettingsClient initialSettings={settings} />
}
