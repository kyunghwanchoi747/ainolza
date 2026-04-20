'use client'

import { useEffect, useState, useRef } from 'react'
import { Star, ExternalLink } from 'lucide-react'

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

  useEffect(() => {
    if (reviews.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % reviews.length)
    }, 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [reviews.length])

  if (reviews.length === 0) return null

  const r = reviews[current]
  const name = r.user?.name || r.user?.email?.split('@')[0] || '수강생'

  return (
    <section className="py-20 px-6 bg-[#111]">
      <div className="max-w-[900px] mx-auto">
        <p className="text-brand text-sm font-bold mb-2 tracking-wide text-center">수강생 후기</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12">
          직접 들은 이야기
        </h2>

        {/* 카드 */}
        <div className="relative min-h-[180px]">
          {reviews.map((rev, i) => {
            const rName = rev.user?.name || rev.user?.email?.split('@')[0] || '수강생'
            return (
              <div
                key={rev.id}
                className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  {/* 별점 */}
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-5 h-5 ${n <= rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                    ))}
                  </div>
                  {/* 내용 */}
                  <p className="text-white/80 text-lg leading-relaxed mb-6 whitespace-pre-line">
                    &ldquo;{rev.content}&rdquo;
                  </p>
                  {/* 작성자 + 사이트 */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-sm">
                        {rName.charAt(0)}
                      </div>
                      <span className="text-white/60 text-sm font-medium">{rName}</span>
                    </div>
                    {rev.siteUrl && (
                      <a
                        href={rev.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-brand/80 hover:text-brand transition-colors border border-brand/30 rounded-full px-3 py-1.5"
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
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i)
                  if (timerRef.current) clearInterval(timerRef.current)
                  timerRef.current = setInterval(() => setCurrent(p => (p + 1) % reviews.length), 4000)
                }}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-brand w-6' : 'bg-white/20'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
