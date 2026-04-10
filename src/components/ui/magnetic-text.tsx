'use client'

import { useRef, useCallback, useEffect, useState } from 'react'

/**
 * 마우스 근접 시 글자가 볼록하게 올라오는 효과
 *
 * 사용법:
 *   <MagneticText text="AI놀자에서 직접 만나보세요" className="text-5xl font-extrabold" />
 *   <MagneticText text="AI놀자에서\n직접 만나보세요" className="..." /> — \n으로 줄바꿈
 */

interface MagneticTextProps {
  text: string
  className?: string
  radius?: number // 효과 반경 (px), 기본 200
  maxScale?: number // 최대 크기 배율, 기본 1.3
  maxLift?: number // 최대 올라가는 높이 (px), 기본 -12
}

export function MagneticText({
  text,
  className = '',
  radius = 200,
  maxScale = 1.25,
  maxLift = -10,
}: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null)
  const rafRef = useRef<number>(0)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setMouse({ x: e.clientX, y: e.clientY })
      })
    },
    [],
  )

  const handleMouseLeave = useCallback(() => {
    setMouse(null)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    // 부모 섹션에서 마우스 추적 (히어로 전체 영역)
    const parent = el.closest('section') || el.parentElement || document
    ;(parent as HTMLElement).addEventListener('mousemove', handleMouseMove)
    ;(parent as HTMLElement).addEventListener('mouseleave', handleMouseLeave)
    return () => {
      ;(parent as HTMLElement).removeEventListener('mousemove', handleMouseMove)
      ;(parent as HTMLElement).removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, handleMouseLeave])

  // \n 으로 줄바꿈 지원
  const lines = text.split('\n')

  return (
    <div ref={containerRef} className={className} aria-label={text.replace('\n', ' ')}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split('').map((char, ci) => (
            <MagneticChar
              key={`${li}-${ci}`}
              char={char}
              mouse={mouse}
              radius={radius}
              maxScale={maxScale}
              maxLift={maxLift}
            />
          ))}
        </span>
      ))}
    </div>
  )
}

function MagneticChar({
  char,
  mouse,
  radius,
  maxScale,
  maxLift,
}: {
  char: string
  mouse: { x: number; y: number } | null
  radius: number
  maxScale: number
  maxLift: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    display: 'inline-block',
    transition: 'transform 0.25s ease-out',
    willChange: 'transform',
  })

  useEffect(() => {
    if (!mouse || !ref.current) {
      setStyle((s) => ({ ...s, transform: 'translateY(0) scale(1)' }))
      return
    }

    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dist = Math.sqrt((mouse.x - cx) ** 2 + (mouse.y - cy) ** 2)

    if (dist > radius) {
      setStyle((s) => ({ ...s, transform: 'translateY(0) scale(1)' }))
      return
    }

    const ratio = 1 - dist / radius // 0 (가장자리) ~ 1 (중심)
    const eased = ratio * ratio // easeIn — 가까울수록 더 급격하게
    const scale = 1 + (maxScale - 1) * eased
    const lift = maxLift * eased

    setStyle((s) => ({
      ...s,
      transform: `translateY(${lift}px) scale(${scale})`,
    }))
  }, [mouse, radius, maxScale, maxLift])

  if (char === ' ') {
    return <span>&nbsp;</span>
  }

  return (
    <span ref={ref} style={style}>
      {char}
    </span>
  )
}
