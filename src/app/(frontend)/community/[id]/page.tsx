import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { CommentSection } from '@/components/frontend/comment-section'

const categoryLabels: Record<string, string> = {
  free: '자유',
  question: '질문',
  share: '공유',
  notice: '공지',
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayloadClient()

  let post: any
  try {
    post = await payload.findByID({ collection: 'posts', id })
  } catch {
    return notFound()
  }

  if (!post || post.status !== 'published') return notFound()

  // Increment views
  await payload.update({
    collection: 'posts',
    id,
    data: { views: (post.views || 0) + 1 },
  })

  // Fetch comments
  const commentsResult = await payload.find({
    collection: 'comments',
    where: { post: { equals: id }, status: { equals: 'approved' } },
    sort: 'createdAt',
    limit: 100,
  })

  const comments = commentsResult.docs.map((c: any) => ({
    id: String(c.id),
    author: c.author || '',
    content: c.content || '',
    createdAt: c.createdAt || '',
  }))

  return (
    <div className="container max-w-screen-lg px-4 py-8">
      <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        &larr; 커뮤니티로 돌아가기
      </Link>

      <article>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={post.category === 'notice' ? 'default' : 'outline'}>
            {categoryLabels[post.category] || post.category}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
          <span>{post.author}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {(post.views || 0) + 1}
          </span>
        </div>

        <div className="whitespace-pre-wrap leading-relaxed min-h-[200px]">
          {post.content}
        </div>
      </article>

      {/* Comments */}
      <div className="mt-12 pt-8 border-t">
        <CommentSection postId={id} initialComments={comments} />
      </div>
    </div>
  )
}
