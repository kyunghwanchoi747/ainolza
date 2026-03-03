import { getPayloadClient } from '@/lib/payload'
import { ProgramFormClient } from '@/components/manager/program-form-client'
import { notFound } from 'next/navigation'

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let program = null

  try {
    const payload = await getPayloadClient()
    const doc = await payload.findByID({
      collection: 'programs',
      id,
    })

    if (!doc) {
      notFound()
    }

    program = {
      id: String(doc.id),
      title: doc.title || '',
      slug: (doc as any).slug || '',
      description: (doc as any).description || '',
      version: (doc as any).version || '',
      downloadUrl: (doc as any).downloadUrl || '',
      platform: (doc as any).platform || 'all',
      category: (doc as any).category || '',
      status: (doc as any).status || 'draft',
      featured: (doc as any).featured || false,
    }
  } catch {
    notFound()
  }

  return <ProgramFormClient mode="edit" initialData={program} />
}
