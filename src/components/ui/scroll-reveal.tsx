'use client'

import { useEffect } from 'react'

/**
 * 스크롤 등장 애니메이션 — CSS only + IntersectionObserver
 * 래퍼 div 없이 기존 요소에 data-reveal 속성만 추가하면 작동.
 *
 * 사용법 (HTML/JSX):
 *   <div data-reveal>내용</div>                     — 기본 fade-up
 *   <div data-reveal="left">내용</div>              — 왼쪽에서
 *   <div data-reveal-delay="200">내용</div>         — 200ms 지연
 *
 * 이 컴포넌트를 layout에 한 번만 마운트하면 전체 사이트에서 작동.
 */
export function ScrollRevealInit(): null {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = el.dataset.revealDelay
            if (delay) {
              el.style.transitionDelay = `${delay}ms`
            }
            el.classList.add('revealed')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.08, rootMargin: '-40px 0px' }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
