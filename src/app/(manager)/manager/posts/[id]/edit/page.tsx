import { getPayloadClient } from '@/lib/payload'
import { PostFormClient } from '@/components/manager/post-form-client'
import { notFound } from 'next/navigation'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let post = null
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findByID({
      collection: 'posts',
      id,
    })
    if (doc) {
      post = {
        id: String(doc.id),
        title: (doc as any).title || '',
        content: (doc as any).content || '',
        author: (doc as any).author || '관리자',
        category: (doc as any).category || 'free',
        status: (doc as any).status || 'draft',
        pinned: (doc as any).pinned || false,
      }
    }
  } catch {
    // post not found
  }

  if (!post) {
    notFound()
  }

  return <PostFormClient mode="edit" initialData={post} />
}
