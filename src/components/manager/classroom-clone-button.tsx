'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type Props = {
  sourceId: number
  sourceSlug: string
  sourceShortTitle: string
  sourceCohort?: number
}

/**
 * 기수 복제 — 기존 강의실의 메타와 회차 구조(week/title만)를 복사해 새 강의실 row 생성.
 * 영상·가이드북·날짜는 비워둠. status는 draft.
 */
export function ClassroomCloneButton({
  sourceId,
  sourceSlug,
  sourceShortTitle,
  sourceCohort,
}: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const proposeNextSlug = () => {
    // vibe-coding-advanced → vibe-coding-advanced-2
    // vibe-coding-advanced-2 → vibe-coding-advanced-3
    const m = sourceSlug.match(/^(.+?)-(\d+)$/)
    if (m) return `${m[1]}-${Number(m[2]) + 1}`
    return `${sourceSlug}-2`
  }

  const proposeNextTitle = () => {
    const next = (sourceCohort ?? 1) + 1
    // 짧은 제목에 "N기"가 들어있으면 치환, 아니면 "N기" 추가
    if (/\d+기/.test(sourceShortTitle)) {
      return sourceShortTitle.replace(/\d+기/, `${next}기`)
    }
    return `${sourceShortTitle} ${next}기`
  }

  const onClick = async () => {
    const newSlug = window.prompt(
      `복제할 새 강의실의 slug를 입력하세요.\n(예: ${proposeNextSlug()})`,
      proposeNextSlug(),
    )
    if (!newSlug) return
    if (!/^[a-z0-9-]+$/.test(newSlug)) {
      toast.error('slug는 영문 소문자/숫자/하이픈만 사용 가능합니다.')
      return
    }

    setBusy(true)
    try {
      // 원본 doc 가져오기
      const srcRes = await fetch(`/api/classrooms/${sourceId}?depth=0`, {
        credentials: 'include',
      })
      if (!srcRes.ok) {
        toast.error('원본 강의실을 불러오지 못했습니다.')
        return
      }
      const src = (await srcRes.json()) as any

      // 회차 구조만 복사 (week/title) — 영상·가이드북·날짜는 모두 빈값
      const blankSessions = Array.isArray(src.sessions)
        ? src.sessions.map((s: any) => ({
            week: Number(s.week) || 0,
            title: s.title || `${s.week}회차`,
          }))
        : []

      const nextCohort = (sourceCohort ?? 1) + 1
      const newShortTitle = proposeNextTitle()
      const newTitle = src.title
        ? /\d+기/.test(src.title)
          ? src.title.replace(/\d+기/, `${nextCohort}기`)
          : `${src.title} (${nextCohort}기)`
        : newShortTitle

      const createRes = await fetch('/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          slug: newSlug,
          title: newTitle,
          shortTitle: newShortTitle,
          description: src.description || undefined,
          level: src.level || '입문',
          cohort: nextCohort,
          schedule: src.schedule || undefined,
          status: 'draft',
          order: (src.order || 999) + 100,
          sessions: blankSessions,
        }),
      })

      if (!createRes.ok) {
        const data = (await createRes.json().catch(() => ({}))) as {
          errors?: any[]
          message?: string
        }
        toast.error(data.errors?.[0]?.message || data.message || '복제 실패')
        return
      }

      const created = (await createRes.json()) as { doc?: { id: number } }
      const newId = created.doc?.id
      toast.success(`${newShortTitle} 생성 완료`)
      if (newId) router.push(`/manager/classrooms/${newId}/edit`)
      else router.refresh()
    } catch (e) {
      toast.error((e as Error).message || '복제 실패')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button onClick={onClick} disabled={busy} variant="ghost" size="sm" title="다음 기수로 복제">
      <Copy className="h-3 w-3 mr-1" />
      {busy ? '복제 중...' : '기수 복제'}
    </Button>
  )
}
