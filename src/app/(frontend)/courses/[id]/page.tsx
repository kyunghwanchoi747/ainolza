import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { ArrowLeft, Clock, User, PlayCircle, Lock, MessageSquare } from 'lucide-react'

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    const [course, commentsResult] = await Promise.all([
      payload.findByID({
        collection: 'courses',
        id,
      }),
      payload.find({
        collection: 'comments',
        where: { content: { equals: id } },
        sort: '-createdAt',
        depth: 1,
      }),
    ])

    if (!course) {
      return <div>Course not found</div>
    }

    const comments = commentsResult.docs || []

    const hasAccess = !!course.streamId

    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-6 py-10">
          {/* Back Button */}
          <Link
            href="/courses"
            className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            강의 목록으로 돌아가기
          </Link>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content (Video & Description) */}
            <div className="flex-1">
              {/* Video Player */}
              <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black aspect-video relative group">
                {hasAccess ? (
                  <iframe
                    src={`https://iframe.videodelivery.net/${course.streamId}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-center p-6">
                    {typeof course.thumbnail === 'object' && course.thumbnail?.url && (
                      <img
                        src={course.thumbnail.url}
                        alt="Thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Lock className="h-8 w-8 text-white/50" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">
                        수강 권한이 필요합니다
                      </h3>
                      <p className="text-gray-400 mb-6 font-medium">
                        이 강의를 시청하려면 구매가 필요합니다.
                      </p>
                      <button className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        강의 구매하기 (
                        {course.price ? `${course.price.toLocaleString()}원` : '무료'})
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="mt-8 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-black text-white uppercase tracking-wider">
                    {course.level || 'Beginner'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration || 'Unknown Duration'}</span>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
                  {course.title}
                </h1>

                <div className="flex items-center gap-4 border-y border-white/10 py-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">AI Nolja Instructor</p>
                      <p className="text-xs text-gray-500">Official Content</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Tab Content */}
              <div className="prose prose-invert prose-lg max-w-none mb-16">
                <h3 className="text-xl font-bold text-white mb-4">강의 소개</h3>
                {/* RichText for description if it was checking field type, but schema says type: 'textarea'
                  Wait, Courses schema says:
                  {
                    name: 'description',
                    type: 'textarea',
                  },
                  So it is just text string, not RichText.
               */}
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Comments Section */}
              <section className="border-t border-white/10 pt-10">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  수강 문의 및 댓글 <span className="text-blue-500">({comments.totalDocs})</span>
                </h3>

                {/* Comment Input Placeholder */}
                <div className="mb-8 flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gray-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <textarea
                      placeholder="강의에 대해 궁금한 점을 남겨주세요."
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
                  {comments.docs.map((comment: any) => (
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
                  {comments.docs.length === 0 && (
                    <p className="text-center text-gray-600 py-4 text-sm">
                      첫 번째 문의를 남겨보세요!
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Sidebar (Curriculum / Recommendations) */}
            <aside className="w-full lg:w-80 shrink-0 space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sticky top-24">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-4">
                  Course Info
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">난이도</span>
                    <span className="font-bold text-white">{course.level || 'Beginner'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">수강 기간</span>
                    <span className="font-bold text-white">무제한</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">가격</span>
                    <span className="font-bold text-blue-400 text-lg">
                      {course.price ? `${course.price.toLocaleString()}원` : '무료'}
                    </span>
                  </div>
                </div>

                <button className="mt-8 w-full rounded-xl bg-white py-3 text-sm font-black text-black hover:scale-105 transition-transform active:scale-95">
                  {hasAccess ? '수강 중인 강의입니다' : '지금 수강 신청하기'}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading course:', error)
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">강의 로드 실패</h1>
            <p className="text-gray-400">강의를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    )
  }
}
