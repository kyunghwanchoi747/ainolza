import { getPayloadClient } from '@/lib/payload'
import { ProgramsListClient } from '@/components/manager/programs-list-client'

export default async function ProgramsPage() {
  let programs: any[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'programs',
      sort: '-updatedAt',
      limit: 100,
    })
    programs = result.docs.map((doc: any) => ({
      id: String(doc.id),
      title: doc.title || '',
      slug: doc.slug || '',
      version: doc.version || '',
      platform: doc.platform || 'all',
      category: doc.category || '',
      status: doc.status || 'draft',
      featured: doc.featured || false,
      updatedAt: doc.updatedAt || '',
    }))
  } catch {
    // collection이 없을 수 있음 - 빈 배열로 진행
  }

  return <ProgramsListClient initialPrograms={programs} />
}
