import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { MessageSquare, Search, User } from 'lucide-react'
import type { CommunityPost } from '@/payload-types'
import { CommunitySidebar } from '@/components/CommunitySidebar'

export default async function CommunityPage() {
  try {
    const payload = await getPayload({ config })

    const { docs: categoryDocs } = await payload.find({
      collection: 'categories',
      where: { type: { equals: 'community' } },
    })

    const { docs: postDocs } = await payload.find({
      collection: 'community-posts',
      sort: '-createdAt',
    })

    return (
      <div className="min-h-screen bg-black pt-20">
        {/* Community Hero */}
        <section className="border-b border-white/10 bg-white/5 py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <h1 className="text-3xl font-black text-white">커뮤니티 광장</h1>
              <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-4 py-2">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="관심 있는 주제를 검색해 보세요"
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto flex flex-col gap-8 px-6 py-10 lg:flex-row">
          {/* Sidebar (Cafe Style) */}
          <CommunitySidebar categories={{ docs: categoryDocs }} />

          {/* Main Content */}
          <main className="flex-grow">
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      <th className="px-8 py-5">게시글 제목</th>
                      <th className="px-8 py-5">작성자</th>
                      <th className="px-8 py-5 text-right uppercase">작성일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {postDocs.length > 0 ? (
                      postDocs.map((post: CommunityPost) => (
                        <tr key={post.id} className="group transition-all hover:bg-blue-600/5">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              {post.isPinned ? (
                                <span className="rounded-lg bg-blue-600 px-2 py-1 text-[8px] font-black text-white uppercase italic">
                                  PINNED
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-gray-600">NEW</span>
                              )}
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/community/${post.id}`}
                                  className="font-bold text-white group-hover:text-blue-400 transition-colors"
                                >
                                  {post.title}
                                </Link>
                                <span className="text-[10px] font-black text-blue-500 opacity-60">
                                  ({post.commentsCount || 0})
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                                <User className="h-3 w-3 text-gray-400" />
                              </div>
                              <span className="text-xs font-medium text-gray-400">
                                {typeof post.author === 'object' && post.author?.nickname
                                  ? post.author.nickname
                                  : '익명회원'}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className="text-[10px] font-bold text-gray-600">
                              {new Date(post.createdAt).toLocaleDateString().replace(/\./g, ' /')}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-8 py-24 text-center">
                          <div className="flex flex-col items-center">
                            <MessageSquare className="h-10 w-10 text-gray-700 mb-4" />
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                              작성된 게시글이 없습니다
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading community posts:', error)
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">커뮤니티 로드 실패</h1>
            <p className="text-gray-400">
              커뮤니티를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </div>
    )
  }
}
