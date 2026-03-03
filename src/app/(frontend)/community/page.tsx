import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'

import { Pin, Eye, MessageSquare } from 'lucide-react'

export const dynamic = 'force-dynamic'

const categoryLabels: Record<string, string> = {
  free: '자유',
  question: '질문',
  share: '공유',
  notice: '공지',
}

export default async function CommunityPage() {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 50,
  })

  const posts = result.docs as any[]
  const pinned = posts.filter(p => p.pinned)
  const regular = posts.filter(p => !p.pinned)
  const sortedPosts = [...pinned, ...regular]

  return (
    <div className="container max-w-screen-lg px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">커뮤니티</h1>
          <p className="text-muted-foreground mt-2">회원들과 자유롭게 소통하세요.</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Badge variant="default" className="cursor-pointer">전체</Badge>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Badge key={key} variant="outline" className="cursor-pointer">{label}</Badge>
        ))}
      </div>

      {sortedPosts.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">아직 게시글이 없습니다.</p>
        </div>
      ) : (
        <div className="rounded-lg border divide-y">
          {sortedPosts.map((post: any) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {post.pinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
                  <Badge variant={post.category === 'notice' ? 'default' : 'outline'} className="text-xs shrink-0">
                    {categoryLabels[post.category] || post.category}
                  </Badge>
                  <span className="font-medium truncate">{post.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views || 0}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
