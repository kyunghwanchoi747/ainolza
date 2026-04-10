'use client'

/**
 * 스크롤 기반 등장 애니메이션 컴포넌트 (TAOS 스타일 + Framer Motion)
 *
 * 사용법:
 *   <Reveal>내용</Reveal>                    — 기본 fade-up
 *   <Reveal direction="left">내용</Reveal>   — 왼쪽에서
 *   <Reveal delay={0.2}>내용</Reveal>        — 0.2초 지연
 *   <StaggerReveal>
 *     <div>카드1</div>
 *     <div>카드2</div>
 *   </StaggerReveal>                          — 순차 등장
 */

import { useRef } from 'react'
import {
  motion,
  useInView,
  type Variants,
  type HTMLMotionProps,
} from 'framer-motion'

// ━━━━━━━━━━━━━━━━━━━
// 단일 요소 등장 (스크롤 reveal)
// ━━━━━━━━━━━━━━━━━━━
type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface RevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  distance?: number // px
  once?: boolean // true면 한 번만 (기본 true)
  className?: string
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance,
  once = true,
  className,
  ...rest
}: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-80px 0px' })

  const offset = directionMap[direction]
  if (distance !== undefined) {
    if ('y' in offset) offset.y = distance * (direction === 'down' ? -1 : 1)
    if ('x' in offset) offset.x = distance * (direction === 'right' ? -1 : 1)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// ━━━━━━━━━━━━━━━━━━━
// 여러 자식 순차 등장 (stagger)
// ━━━━━━━━━━━━━━━━━━━
interface StaggerRevealProps {
  children: React.ReactNode
  stagger?: number // 각 항목 간격 (초)
  direction?: Direction
  duration?: number
  className?: string
  once?: boolean
}

const containerVariants = (stagger: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger },
  },
})

const itemVariants = (direction: Direction, duration: number): Variants => {
  const offset = { ...directionMap[direction] }
  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }
}

export function StaggerReveal({
  children,
  stagger = 0.1,
  direction = 'up',
  duration = 0.5,
  className,
  once = true,
}: StaggerRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px 0px' })

  return (
    <motion.div
      ref={ref}
      variants={containerVariants(stagger)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, i) => (
          <motion.div key={i} variants={itemVariants(direction, duration)}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants(direction, duration)}>
          {children}
        </motion.div>
      )}
    </motion.div>
  )
}

// ━━━━━━━━━━━━━━━━━━━
// 호버 + 프레스 래퍼
// ━━━━━━━━━━━━━━━━━━━
interface HoverScaleProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  scale?: number
  className?: string
}

export function HoverScale({
  children,
  scale = 1.03,
  className,
  ...rest
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
