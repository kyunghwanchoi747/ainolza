"use client"

import { useEffect, useState } from 'react'

function getReactFiber(element: HTMLElement): any {
  const key = Object.keys(element).find(
    (k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')
  )
  return key ? (element as any)[key] : null
}

function parseStack(stack: any): { file: string; line: number } | null {
  if (!stack) return null
  const stackStr = stack.stack || stack
  if (typeof stackStr !== 'string') return null

  for (const rawLine of stackStr.split('\n')) {
    const line = rawLine.trim()
    if (!line.startsWith('at ')) continue

    // webpack-internal:///(app-pages-browser)/src/... 패턴
    const webpackMatch = line.match(/webpack-internal:\/\/\/[^/]+\/(.+\.tsx?):(\d+)/)
    if (webpackMatch) {
      return { file: webpackMatch[1], line: parseInt(webpackMatch[2]) }
    }

    // 실제 파일 경로 패턴: at Name (C:\...\file.tsx:76:11)
    const fsMatch = line.match(/at \S+ \((.+\.tsx?):(\d+):\d+\)/)
    if (fsMatch && !fsMatch[1].includes('node_modules')) {
      return { file: fsMatch[1], line: parseInt(fsMatch[2]) }
    }
  }
  return null
}

function findSource(fiber: any): { file: string; line: number } | null {
  let current = fiber
  const visited = new Set()
  while (current && !visited.has(current)) {
    visited.add(current)
    if (current._debugStack) {
      const parsed = parseStack(current._debugStack)
      if (parsed) return parsed
    }
    if (current._debugSource?.fileName) {
      return { file: current._debugSource.fileName, line: current._debugSource.lineNumber }
    }
    current = current.return
  }
  return null
}

function findSourceForElement(el: HTMLElement): { file: string; line: number } | null {
  let target: HTMLElement | null = el
  let depth = 0
  while (target && depth < 15) {
    const fiber = getReactFiber(target)
    if (fiber) {
      const source = findSource(fiber)
      if (source) return source
    }
    target = target.parentElement
    depth++
  }
  return null
}

export default function ClickToComponentWrapper() {
  const [hover, setHover] = useState<{
    x: number; y: number; w: number; h: number; label: string
  } | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const handleMouseMove = (e: MouseEvent) => {
      if (!e.altKey) { setHover(null); return }
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
      if (!el) return
      const source = findSourceForElement(el)
      if (!source) { setHover(null); return }
      const rect = el.getBoundingClientRect()
      const shortName = source.file.replace(/.*[/\\]/, '')
      setHover({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        w: rect.width,
        h: rect.height,
        label: `${shortName}:${source.line}`,
      })
    }

    const handleClick = async (e: MouseEvent) => {
      if (!e.altKey) return
      e.preventDefault()
      e.stopPropagation()
      const el = e.target as HTMLElement
      const source = findSourceForElement(el)
      if (!source) return
      // 서버에서 전체 경로 받아서 vscode:// URL로 열기
      const res = await fetch(`/api/dev/open-file?file=${encodeURIComponent(source.file)}&line=${source.line}`)
      const data = await res.json()
      if (data.path) {
        // path와 line 분리
        const lastColon = data.path.lastIndexOf(':')
        const filePath = data.path.substring(0, lastColon)
        const lineNum = data.path.substring(lastColon + 1)
        // Windows 백슬래시 → 슬래시, 한국어/공백만 인코딩 (: / 는 유지)
        const encoded = encodeURI(filePath.replace(/\\/g, '/'))
        const a = document.createElement('a')
        a.href = `vscode://file/${encoded}:${lineNum}`
        a.click()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') setHover(null)
    }

    document.addEventListener('mousemove', handleMouseMove, true)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  if (!hover) return null

  return (
    <>
      <div style={{
        position: 'absolute', left: hover.x, top: hover.y,
        width: hover.w, height: hover.h,
        border: '2px solid #22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        pointerEvents: 'none', zIndex: 99999,
      }} />
      <div style={{
        position: 'absolute', left: hover.x, top: hover.y - 24,
        backgroundColor: '#22d3ee', color: '#000',
        fontSize: '12px', fontWeight: 600,
        padding: '2px 8px', borderRadius: '4px',
        pointerEvents: 'none', zIndex: 99999, whiteSpace: 'nowrap',
      }}>
        {hover.label}
      </div>
    </>
  )
}
