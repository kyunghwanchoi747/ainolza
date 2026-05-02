import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { ClassroomEditClient } from '@/components/manager/classroom-edit-client'

export const dynamic = 'force-dynamic'

export default async function ClassroomEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let doc: any = null
  try {
    const payload = await getPayloadClient()
    doc = await payload.findByID({
      collection: 'classrooms' as any,
      id,
      depth: 0,
      overrideAccess: true,
    })
  } catch {
    return notFound()
  }

  if (!doc) return notFound()

  const initial = {
    id: doc.id,
    slug: doc.slug,
    title: doc.title || '',
    shortTitle: doc.shortTitle || '',
    level: doc.level || '입문',
    cohort: doc.cohort ?? null,
    description: doc.description || '',
    schedule: doc.schedule || '',
    liveUrl: doc.liveUrl || '',
    resourceUrl: doc.resourceUrl || '',
    status: doc.status || 'active',
    sessions: Array.isArray(doc.sessions)
      ? doc.sessions.map((s: any) => ({
          week: Number(s.week) || 0,
          title: s.title || '',
          date: s.date || '',
          vimeoId: s.vimeoId || '',
          youtubeLiveUrl: s.youtubeLiveUrl || '',
          guidebookUrl: s.guidebookUrl || '',
          secretEnabled: !!s.secretEnabled,
          secretPassword: s.secretPassword || '',
          secretNotionUrl: s.secretNotionUrl || '',
          secretLabel: s.secretLabel || '',
        }))
      : [],
  }

  return <ClassroomEditClient initial={initial} />
}
