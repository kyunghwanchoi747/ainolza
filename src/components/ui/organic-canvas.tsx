'use client'

import { useEffect, useRef } from 'react'

const COLORS = [
  '212, 117, 110',  // brand coral #D4756E
  '124, 58, 237',   // purple #7C3AED
  '16, 185, 129',   // teal #10b981
  '59, 130, 246',   // blue #3B82F6
]

class Organism {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  speed: number
  size: number
  maxLength: number
  wiggleOffset: number
  history: { x: number; y: number }[]
  color: string

  constructor(w: number, h: number) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = 0
    this.vy = 0
    this.angle = Math.random() * Math.PI * 2
    this.speed = 0.6 + Math.random() * 0.8
    this.size = 1.5 + Math.random() * 2.5
    this.maxLength = 12 + Math.random() * 18
    this.wiggleOffset = Math.random() * 100
    this.history = []
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
  }

  update(w: number, h: number, mx: number, my: number) {
    this.angle += (Math.random() - 0.5) * 0.08

    const dx = mx - this.x
    const dy = my - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 130) {
      this.angle = Math.atan2(dy, dx) + Math.PI
      this.speed = Math.min(this.speed + 0.2, 2.5)
    } else {
      this.speed = Math.max(0.6, this.speed - 0.04)
    }

    const wiggle = Math.sin(Date.now() * 0.004 + this.wiggleOffset) * 0.4
    this.vx = Math.cos(this.angle + wiggle) * this.speed
    this.vy = Math.sin(this.angle + wiggle) * this.speed

    this.x += this.vx
    this.y += this.vy

    if (this.x < -50) this.x = w + 50
    if (this.x > w + 50) this.x = -50
    if (this.y < -50) this.y = h + 50
    if (this.y > h + 50) this.y = -50

    this.history.unshift({ x: this.x, y: this.y })
    if (this.history.length > this.maxLength) this.history.pop()
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.history.length < 2) return

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // 꼬리
    ctx.beginPath()
    ctx.moveTo(this.history[0].x, this.history[0].y)
    for (let i = 1; i < this.history.length; i++) {
      ctx.lineTo(this.history[i].x, this.history[i].y)
    }
    ctx.strokeStyle = `rgba(${this.color}, 0.55)`
    ctx.lineWidth = this.size
    ctx.stroke()

    // 머리
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 1.6, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${this.color}, 0.9)`
    ctx.fill()
  }
}

export function OrganicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const mouse = useRef({ x: -1000, y: -1000 })
  const organisms = useRef<Organism[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseOut = () => {
      mouse.current = { x: -1000, y: -1000 }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseout', onMouseOut)

    // 유기체 생성
    organisms.current = Array.from({ length: 22 }, () =>
      new Organism(canvas.width, canvas.height)
    )

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mx, y: my } = mouse.current
      for (const org of organisms.current) {
        org.update(canvas.width, canvas.height, mx, my)
        org.draw(ctx)
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
