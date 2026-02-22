import { getPayload } from '@/lib/payload'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  FileText,
  Lock,
  CheckCircle,
  MessageSquare,
  User,
} from 'lucide-react'
import { AddToCartButton } from '@/components/AddToCartButton'

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayload()

    const [program, commentsResult] = await Promise.all([
      payload.findByID({
        collection: 'programs',
        id,
      }),
      payload.find({
        collection: 'comments',
        where: {
          'doc.value': { equals: id },
        },
        sort: '-createdAt',
        depth: 1,
      }),
    ])

    if (!program) {
      return (
        <div className="min-h-screen bg-black text-white p-20 text-center">
          상품을 찾을 수 없습니다.
        </div>
      )
    }

    const comments = commentsResult.docs || []

    const hasAccess = !!program.file

    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-10">
          {/* Back Button */}
          <Link
            href="/shop"
            className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            스토어로 돌아가기
          </Link>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1">
              {/* Hero Section */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-lg bg-emerald-500 px-2 py-1 text-[10px] font-black text-black uppercase tracking-wider">
                    PROGRAM & BOOK
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    {program.category || 'General'}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
                  {program.title}
                </h1>

                <div className="flex items-center gap-4 border-y border-white/10 py-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Digital Product</p>
                      <p className="text-xs text-gray-500">Instant Download</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-invert prose-lg max-w-none mb-16">
                <h3 className="text-xl font-bold text-white mb-4">상품 소개</h3>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {program.description}
                </p>
              </div>

              {/* Comments Section */}
              <section className="border-t border-white/10 pt-10">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-500" />
                  상품 문의 및 후기 <span className="text-emerald-500">({comments.length})</span>
                </h3>

                {/* Comment Input Placeholder */}
                <div className="mb-8 flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gray-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <textarea
                      placeholder="상품에 대한 문의를 남겨주세요."
                      className="w-full h-24 rounded-xl bg-black/50 border border-white/10 p-4 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
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
                      첫 번째 후기를 남겨보세요!
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Sidebar (Action) */}
            <aside className="w-full lg:w-96 shrink-0 space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sticky top-24">
                {hasAccess ? (
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-black text-white">구매 완료</h3>
                    <p className="text-sm text-gray-400 mt-2">언제든지 다운로드 가능합니다.</p>
                  </div>
                ) : (
                  <div className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-sm text-blue-400 font-bold">🎯 지금 바로 시작하세요!</p>
                  </div>
                )}

                <div className="space-y-6 border-b border-white/10 pb-8 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">가격</span>
                    <span className="font-bold text-white text-2xl">
                      {program.price ? `${program.price.toLocaleString()}원` : '무료'}
                    </span>
                  </div>
                  {program.link && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">외부 링크</span>
                      <a
                        href={program.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-400 underline decoration-blue-400/30 hover:decoration-blue-400"
                      >
                        페이지 방문
                      </a>
                    </div>
                  )}
                </div>

                {hasAccess ? (
                  typeof program.file === 'object' && program.file?.url ? (
                    <a
                      href={program.file.url}
                      download
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 text-sm font-black text-black hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <Download className="h-5 w-5" />
                      파일 다운로드
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-700 py-4 text-sm font-black text-gray-400 cursor-not-allowed"
                    >
                      파일 없음
                    </button>
                  )
                ) : (
                  <AddToCartButton
                    item={{
                      id: String(program.id),
                      productType: 'programs',
                      title: program.title,
                      price: program.price ?? 0,
                    }}
                  />
                )}

                {!hasAccess && (
                  <p className="mt-4 text-center text-xs text-gray-500">
                    <Lock className="inline-block h-3 w-3 mr-1" />
                    안전한 결제 시스템을 이용합니다.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading program:', error)
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-12">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">상품 로드 실패</h1>
            <p className="text-gray-400">상품을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    )
  }
}
