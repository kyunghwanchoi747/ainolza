'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { ReviewItem } from './LandingPageV3'

const typeBadgeColor = (type?: string) => {
  switch (type) {
    case 'class': return { bg: 'rgba(212, 117, 110, 0.15)', fg: '#D4756E' }
    case 'ebook': return { bg: 'rgba(59, 130, 246, 0.15)', fg: '#3B82F6' }
    case 'book': return { bg: 'rgba(245, 158, 11, 0.15)', fg: '#F59E0B' }
    case 'bundle': return { bg: 'rgba(168, 85, 247, 0.15)', fg: '#A855F7' }
    default: return { bg: 'rgba(255,255,255,0.1)', fg: 'rgba(255,255,255,0.7)' }
  }
}

const typeLabel = (t?: string) =>
  t === 'class' ? '강의' : t === 'ebook' ? '전자책' : t === 'book' ? '종이책' : t === 'bundle' ? '번들' : ''

export function ReviewsSlider({ reviews }: { reviews: ReviewItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateButtons = () => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateButtons()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateButtons, { passive: true })
    window.addEventListener('resize', updateButtons)
    return () => {
      el.removeEventListener('scroll', updateButtons)
      window.removeEventListener('resize', updateButtons)
    }
  }, [reviews])

  const scrollBy = (dir: 'prev' | 'next') => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLDivElement>('[data-review-card]')
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' })
  }

  return (
    <section className="section" style={{ padding: '35px 24px 120px' }}>
      <div className="container">
        <div className="headingCenter">
          <p className="eyebrow">REAL STORIES</p>
          <h2 className="h2">수강생들의 생생한 후기</h2>
        </div>

        {/* position:relative 만 있으면 자식 flex 트랙의 overflowX:auto 가 무효화되어
            페이지 전체가 좌우로 흔들릴 수 있음 → overflow:hidden 으로 viewport 밖을 가둠.
            트랙 자체의 가로 스크롤(키보드/터치)은 그대로 동작. */}
        <div style={{ position: 'relative', marginTop: 40, overflow: 'hidden' }}>
          {/* 좌측 화살표 */}
          <button
            type="button"
            onClick={() => scrollBy('prev')}
            aria-label="이전 후기"
            disabled={!canPrev}
            className="reviewArrow reviewArrowLeft"
          >
            <ChevronLeft size={20} />
          </button>

          {/* 슬라이더 트랙 */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: 24,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              paddingBottom: 8,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
            className="hideScrollbar"
          >
            {reviews.map((r, i) => {
              const badge = typeBadgeColor(r.productType)
              const type = typeLabel(r.productType)
              return (
                <article
                  key={i}
                  data-review-card
                  className="reviewCard glass sheen"
                  style={{
                    flex: '0 0 340px',
                    maxWidth: 340,
                    scrollSnapAlign: 'start',
                  }}
                >
                  {/* 상품 라벨 */}
                  {r.productLabel ? (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: badge.bg,
                        color: badge.fg,
                        fontSize: 11,
                        fontWeight: 700,
                        marginBottom: 12,
                        maxWidth: '100%',
                      }}
                    >
                      {type && <span style={{ opacity: 0.85 }}>[{type}]</span>}
                      <span style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>{r.productLabel}</span>
                    </div>
                  ) : (
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 11,
                      fontWeight: 700,
                      marginBottom: 12,
                    }}>전체 추천</div>
                  )}

                  <div className="stars">
                    {[0, 1, 2, 3, 4].map((j) => (
                      <Star key={j} size={16} fill="currentColor" stroke="none" />
                    ))}
                  </div>

                  <p className="reviewQuote">&ldquo;{r.quote}&rdquo;</p>

                  <div className="reviewer">
                    <div className="avatar" style={{ background: r.color }}>{r.initial}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p className="reviewerName">{r.name}</p>
                      <p className="reviewerMeta">{r.meta}</p>
                    </div>
                    {r.siteUrl && (
                      <a
                        href={r.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reviewerTag"
                        style={{ textDecoration: 'none' }}
                      >
                        사이트 →
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {/* 우측 화살표 */}
          <button
            type="button"
            onClick={() => scrollBy('next')}
            aria-label="다음 후기"
            disabled={!canNext}
            className="reviewArrow reviewArrowRight"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
