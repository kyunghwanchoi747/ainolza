'use client'

import { useEffect, useState, useRef } from 'react'
import { Star, ExternalLink, Quote } from 'lucide-react'

type Review = {
  id: number
  rating: number
  content: string
  siteUrl?: string
  user?: { name?: string; email?: string } | null
}

export function ReviewBanner() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/api/reviews?where[status][equals]=approved&sort=order&limit=50&depth=1')
      .then(r => r.ok ? r.json() : null)
      .then((data: any) => {
        if (data?.docs?.length > 0) {
          setReviews(data.docs.map((d: any) => ({
            id: d.id,
            rating: d.rating,
            content: d.content,
            siteUrl: d.siteUrl || null,
            user: typeof d.user === 'object' ? d.user : null,
          })))
        }
      })
      .catch(() => {})
  }, [])

  const startTimer = (len: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % len)
    }, 5000)
  }

  useEffect(() => {
    if (reviews.length <= 1) return
    startTimer(reviews.length)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [reviews.length])

  if (reviews.length === 0) return null

  return (
    <section className="py-24 md:py-32 px-6 bg-dark-blue">
      <div className="max-w-[800px] mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-4">수강생 후기</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            직접 들은 이야기
          </h2>
        </div>

        {/* 카드 슬라이드 */}
        <div className="relative" style={{ minHeight: '220px' }}>
          {reviews.map((rev, i) => {
            const rName = rev.user?.name || rev.user?.email?.split('@')[0] || '수강생'
            return (
              <div
                key={rev.id}
                className={`absolute inset-0 transition-all duration-700 ${
                  i === current
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-3 pointer-events-none'
                }`}
              >
                <div className="relative bg-white/[0.06] border border-white/10 rounded-2xl p-8 md:p-10">
                  {/* 따옴표 장식 */}
                  <Quote className="absolute top-6 right-8 w-8 h-8 text-white/5 rotate-180" />

                  {/* 별점 */}
                  <div className="flex gap-0.5 mb-6">
                    {[1,2,3,4,5].map(n => (
                      <Star
                        key={n}
                        className={`w-4 h-4 ${n <= rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/15'}`}
                      />
                    ))}
                  </div>

                  {/* 내용 */}
                  <p className="text-white/75 text-base md:text-lg leading-[1.8] mb-8 whitespace-pre-line">
                    {rev.content}
                  </p>

                  {/* 작성자 */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-sm shrink-0">
                        {rName.charAt(0)}
                      </div>
                      <span className="text-white/50 text-sm font-medium">{rName}</span>
                    </div>
                    {rev.siteUrl && (
                      <a
                        href={rev.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs text-brand/70 hover:text-brand transition-colors border border-brand/20 hover:border-brand/50 rounded-full px-3 py-1.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        내 사이트 보기
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 인디케이터 */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i)
                  startTimer(reviews.length)
                }}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current ? 'w-8 bg-brand' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
