'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

type Review = {
  id: number
  rating: number
  content: string
  createdAt: string
  user?: { name?: string; email?: string } | null
}

interface ReviewSectionProps {
  productSlug: string
  productId: number
}

export function ReviewSection({ productSlug, productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; name?: string; email: string } | null>(null)
  const [canWrite, setCanWrite] = useState(false) // 구매자만 작성 가능
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // 로그인 상태 + 구매 여부 확인
  useEffect(() => {
    (async () => {
      try {
        const meRes = await fetch('/api/users/me', { credentials: 'include' })
        if (!meRes.ok) return
        const meData = (await meRes.json()) as { user?: { id: number; name?: string; email: string } }
        if (!meData.user) return
        setUser(meData.user)

        // 이 상품을 paid로 구매했는지 확인
        const ordersRes = await fetch(
          `/api/orders?where[and][0][user][equals]=${meData.user.id}&where[and][1][status][equals]=paid&limit=200&depth=0`,
          { credentials: 'include' },
        )
        if (ordersRes.ok) {
          const ordersData = (await ordersRes.json()) as { docs?: any[] }
          // classrooms이나 productName으로 매칭
          const hasPurchased = (ordersData.docs || []).some((o: any) => {
            const cls = o.classrooms || []
            return cls.includes(productSlug) || (o.productName || '').includes(productSlug)
          })
          setCanWrite(hasPurchased)
        }
      } catch {
        // 비로그인
      }
    })()
  }, [productSlug])

  // 승인된 후기 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/reviews?where[and][0][product][equals]=${productId}&where[and][1][status][equals]=approved&sort=-createdAt&limit=50&depth=1`,
        )
        if (res.ok) {
          const data = (await res.json()) as { docs?: any[] }
          setReviews(
            (data.docs || []).map((d: any) => ({
              id: d.id,
              rating: d.rating,
              content: d.content,
              createdAt: d.createdAt,
              user: typeof d.user === 'object' ? d.user : null,
            })),
          )
        }
      } catch {
        // 무시
      } finally {
        setLoading(false)
      }
    })()
  }, [productId, submitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          product: productId,
          user: user.id,
          rating,
          content: content.trim(),
          status: 'approved',
        }),
      })
      if (res.ok || res.status === 201) {
        setSubmitted(true)
        setShowForm(false)
        setContent('')
      }
    } catch {
      // 무시
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null

  return (
    <section className="py-20 px-6 border-t border-line">
      <div className="max-w-[900px] mx-auto">
        {/* 헤더 */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand text-sm md:text-base font-bold mb-2 tracking-wide">
              수강생 후기
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">후기</h2>
              {avgRating && (
                <span className="text-sub text-lg">
                  ⭐ {avgRating} ({reviews.length}개)
                </span>
              )}
            </div>
          </div>
          {canWrite && !showForm && !submitted && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all cursor-pointer text-sm"
            >
              후기 작성
            </button>
          )}
        </div>

        {/* 후기 작성 완료 메시지 */}
        {submitted && (
          <div className="mb-8 p-5 rounded-2xl bg-brand-light border border-brand/30 text-center">
            <p className="text-brand font-bold">후기가 등록되었습니다 ✨</p>
          </div>
        )}

        {/* 후기 작성 폼 */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-10 p-6 rounded-2xl border-2 border-line bg-surface">
            <p className="font-bold text-ink mb-4">후기 작성</p>

            {/* 별점 */}
            <div className="flex items-center gap-1 mb-4">
              <span className="text-sm text-sub mr-2">별점</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* 내용 */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-line bg-white text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors resize-none text-base mb-4"
              placeholder="수강 경험을 자유롭게 작성해주세요 (다른 수강생에게 큰 도움이 됩니다)"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? '제출 중...' : '후기 제출'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-line text-sub font-medium rounded-xl hover:bg-surface transition-all cursor-pointer"
              >
                취소
              </button>
            </div>
          </form>
        )}

        {/* 후기 목록 */}
        {loading ? (
          <p className="text-sub text-center py-10">로딩 중...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">💬</p>
            <p className="text-ink font-bold mb-1">아직 후기가 없습니다</p>
            <p className="text-sub text-sm">
              {canWrite ? '첫 번째 후기를 남겨주세요!' : '수강생 분들의 후기를 기다리고 있어요.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => {
              const name = r.user?.name || r.user?.email?.split('@')[0] || '수강생'
              const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString('ko-KR') : ''
              return (
                <div key={r.id} className="p-5 rounded-2xl border border-line bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-sub">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-ink text-sm">{name}</p>
                        <p className="text-xs text-sub">{date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${
                            n <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-body text-sm leading-relaxed whitespace-pre-line">{r.content}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
