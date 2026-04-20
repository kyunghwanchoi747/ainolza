'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type BannerItem = {
  slug: string
  title: string
  shortDescription?: string
  thumbnail: string
  category: string
  price?: number
  priceLabel?: string
}

export function StoreBanner({ items }: { items: BannerItem[] }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length)
    }, 4000)
  }

  useEffect(() => {
    if (items.length <= 1) return
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [items.length])

  const go = (idx: number) => {
    setCurrent((idx + items.length) % items.length)
    startTimer()
  }

  if (items.length === 0) return null

  return (
    <div className="relative w-full overflow-hidden bg-[#f8f7f5] rounded-3xl mb-16" style={{ aspectRatio: '16/6' }}>
      {items.map((item, i) => (
        <Link
          key={item.slug}
          href={`/store/${item.slug}`}
          className={`absolute inset-0 flex transition-opacity duration-700 ${i === current ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          {/* 왼쪽: 텍스트 */}
          <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-8">
            <p className="text-xs font-bold text-brand tracking-widest uppercase mb-3">{item.category}</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-ink leading-tight mb-4 whitespace-pre-line">
              {item.title}
            </h2>
            {item.shortDescription && (
              <p className="text-sm md:text-base text-body line-clamp-2 mb-6">{item.shortDescription}</p>
            )}
            <div>
              {item.priceLabel ? (
                <span className="text-brand font-extrabold text-lg">{item.priceLabel}</span>
              ) : item.price ? (
                <span className="text-brand font-extrabold text-2xl">{item.price.toLocaleString('ko-KR')}원</span>
              ) : null}
            </div>
            <div className="mt-6">
              <span className="inline-block px-6 py-2.5 bg-brand text-white font-bold rounded-full text-sm hover:bg-brand-dark transition-colors">
                자세히 보기 →
              </span>
            </div>
          </div>

          {/* 오른쪽: 이미지 */}
          <div className="w-[35%] flex items-center justify-center p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnail}
              alt={item.title}
              className="max-h-full max-w-full object-contain drop-shadow-xl"
            />
          </div>
        </Link>
      ))}

      {/* 이전/다음 버튼 */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); go(current - 1) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); go(current + 1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 text-ink" />
          </button>

          {/* 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); go(i) }}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-brand' : 'w-1.5 bg-ink/20'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
