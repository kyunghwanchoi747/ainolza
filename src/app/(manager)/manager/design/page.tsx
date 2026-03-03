import { getPayloadClient } from '@/lib/payload'
import { DesignListClient } from '@/components/manager/design-list-client'

export const dynamic = 'force-dynamic'

interface DesignPage {
  id: string
  title: string
  slug: string
  status: string
  updatedAt: string
  createdAt: string
}

export default async function DesignListPage() {
  let pages: DesignPage[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'design-pages',
      sort: '-updatedAt',
      limit: 100,
    })
    pages = result.docs.map((doc: any) => ({
      id: String(doc.id),
      title: doc.title || '',
      slug: doc.slug || '',
      status: doc.status || 'draft',
      updatedAt: doc.updatedAt || '',
      createdAt: doc.createdAt || '',
    }))
  } catch {
    // DB not ready
  }

  return <DesignListClient initialPages={pages} />
}
