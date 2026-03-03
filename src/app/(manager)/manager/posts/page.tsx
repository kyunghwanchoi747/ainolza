import { getPayloadClient } from '@/lib/payload'
import { PostsListClient } from '@/components/manager/posts-list-client'

export default async function PostsPage() {
  let posts: {
    id: string
    title: string
    author: string
    category: string
    status: string
    views: number
    pinned: boolean
    updatedAt: string
  }[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      sort: '-updatedAt',
      limit: 100,
    })
    posts = result.docs.map((doc: any) => ({
      id: String(doc.id),
      title: doc.title || '',
      author: doc.author || '관리자',
      category: doc.category || 'free',
      status: doc.status || 'draft',
      views: doc.views || 0,
      pinned: doc.pinned || false,
      updatedAt: doc.updatedAt || '',
    }))
  } catch {
    // posts collection may not exist yet
  }

  return <PostsListClient initialPosts={posts} />
}
