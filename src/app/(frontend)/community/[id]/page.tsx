import { getPayload } from '@/lib/payload'
import Link from 'next/link'
import { MessageSquare, User, ThumbsUp, ArrowLeft } from 'lucide-react'
import { CommunitySidebar } from '@/components/CommunitySidebar'
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const payload = await getPayload()

    let post: any = null
    try {
      post = await payload.findByID({
        collection: 'community-posts',
        id,
      })
    } catch (err) {
      console.error('Post not found:', id)
    }

    if (!post) {
      return <div className="min-h-screen bg-black text-white p-20">게시물을 찾을 수 없습니다.</div>
    }

    // Fetch comments for this post
    const commentsResult = await payload.find({
      collection: 'comments',
      where: {
        'doc.value': { equals: id },
      },
      sort: '-createdAt',
    })
    const comments = commentsResult.docs || []

    const categories: { docs: any[] } = { docs: [] }

    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto flex flex-col gap-8 px-6 py-10 lg:flex-row">
          {/* Sidebar */}
          <CommunitySidebar categories={categories} />

          {/* Main Content */}
          <main className="flex-grow">
            {/* Back Button */}
            <Link
              href="/community"
              className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로 돌아가기
            </Link>

            {/* Post Container */}
            <article className="rounded-[2.5rem] border border-white/10 bg-white/5 overflow-hidden shadow-2xl p-8 lg:p-12">
              {/* Header */}
              <header className="mb-8 border-b border-white/10 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  {post.isPinned ? (
                    <span className="rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-black text-white uppercase italic">
                      PINNED
                    </span>
                  ) : (
                    <span className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-gray-400">
                      BOARD
                    </span>
                  )}
                  <span className="text-xs font-medium text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {typeof post.author === 'object' && post.author?.nickname
                          ? post.author.nickname
                          : 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500">Author</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-xs font-bold">{post.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Content */}
              <div className="prose prose-invert prose-lg max-w-none mb-12">
                {post.content && <RichText data={post.content} />}
              </div>

              {/* Comments Section */}
              <section className="border-t border-white/10 pt-10">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  댓글 <span className="text-blue-500">({comments.length})</span>
                </h3>

                {/* Comment Input Placeholder */}
                <div className="mb-8 flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gray-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <textarea
                      placeholder="댓글을 작성하려면 로그인이 필요합니다."
                      className="w-full h-24 rounded-xl bg-black/50 border border-white/10 p-4 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                      disabled
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        disabled
                        className="px-6 py-2 rounded-xl bg-white/10 text-gray-500 text-sm font-bold cursor-not-allowed"
                      >
                        등록
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">
                            {typeof comment.user === 'object' ? comment.user.nickname : 'User'}
                          </span>
                          <span className="text-xs text-gray-600">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-center text-gray-600 py-4 text-sm">
                      첫 번째 댓글을 남겨보세요!
                    </p>
                  )}
                </div>
              </section>
            </article>
          </main>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading community post:', error)
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-12">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">게시물 로드 실패</h1>
            <p className="text-gray-400">게시물을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    )
  }
}
