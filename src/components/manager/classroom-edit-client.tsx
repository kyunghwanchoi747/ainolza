'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, ExternalLink, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type Session = {
  week: number
  title: string
  date: string
  vimeoId: string
  youtubeLiveUrl: string
  guidebookUrl: string
  secretEnabled: boolean
  secretPassword: string
  secretNotionUrl: string
  secretLabel: string
}

type Initial = {
  id: number
  slug: string
  title: string
  shortTitle: string
  level: string
  cohort: number | null
  description: string
  schedule: string
  liveUrl: string
  resourceUrl: string
  status: string
  sessions: Session[]
}

const emptySession = (week: number): Session => ({
  week,
  title: `${week}회차`,
  date: '',
  vimeoId: '',
  youtubeLiveUrl: '',
  guidebookUrl: '',
  secretEnabled: false,
  secretPassword: '',
  secretNotionUrl: '',
  secretLabel: '',
})

export function ClassroomEditClient({ initial }: { initial: Initial }) {
  const [meta, setMeta] = useState({
    schedule: initial.schedule,
    liveUrl: initial.liveUrl,
    resourceUrl: initial.resourceUrl,
    status: initial.status,
  })
  const [sessions, setSessions] = useState<Session[]>(
    [...initial.sessions].sort((a, b) => a.week - b.week)
  )
  const [saving, setSaving] = useState(false)

  const updateSession = (idx: number, patch: Partial<Session>) => {
    setSessions((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  }

  const addSession = () => {
    const nextWeek = sessions.length === 0 ? 1 : Math.max(...sessions.map((s) => s.week)) + 1
    setSessions((prev) => [...prev, emptySession(nextWeek)])
  }

  const removeSession = (idx: number) => {
    if (!confirm(`${sessions[idx].week}회차를 삭제하시겠습니까?`)) return
    setSessions((prev) => prev.filter((_, i) => i !== idx))
  }

  const save = async () => {
    setSaving(true)
    try {
      const payload = {
        schedule: meta.schedule || null,
        liveUrl: meta.liveUrl || null,
        resourceUrl: meta.resourceUrl || null,
        status: meta.status,
        sessions: sessions
          .slice()
          .sort((a, b) => a.week - b.week)
          .map((s) => ({
            week: Number(s.week) || 0,
            title: s.title,
            date: s.date || null,
            vimeoId: s.vimeoId || null,
            youtubeLiveUrl: s.youtubeLiveUrl || null,
            guidebookUrl: s.guidebookUrl || null,
            secretEnabled: !!s.secretEnabled,
            secretPassword: s.secretEnabled ? s.secretPassword || null : null,
            secretNotionUrl: s.secretEnabled ? s.secretNotionUrl || null : null,
            secretLabel: s.secretEnabled ? s.secretLabel || null : null,
          })),
      }

      const res = await fetch(`/api/classrooms/${initial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { errors?: any[]; message?: string }
        const msg = data.errors?.[0]?.message || data.message || '저장 실패'
        toast.error(msg)
        return
      }

      toast.success('저장되었습니다.')
    } catch (e) {
      toast.error((e as Error).message || '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/manager/classrooms"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          강의실 목록
        </Link>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">{initial.shortTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {initial.title}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{initial.level}</Badge>
              <span className="text-xs text-muted-foreground">/{initial.slug}</span>
              {initial.cohort && (
                <span className="text-xs text-muted-foreground">· {initial.cohort}기</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm">
              <a href={`/classroom/${initial.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                강의실 보기
              </a>
            </Button>
            <Button onClick={save} disabled={saving} size="sm">
              <Save className="mr-1 h-3 w-3" />
              {saving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>강의실 설정</CardTitle>
          <CardDescription>강의실 페이지 상단에 표시되는 공통 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-1 text-muted-foreground">
              일정 안내 텍스트
            </label>
            <Input
              value={meta.schedule}
              onChange={(e) => setMeta((m) => ({ ...m, schedule: e.target.value }))}
              placeholder="예: 매주 수 21시, 4회차"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">
              라이브 URL
            </label>
            <Input
              value={meta.liveUrl}
              onChange={(e) => setMeta((m) => ({ ...m, liveUrl: e.target.value }))}
              placeholder="https://youtube.com/live/..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">
              전체 자료 URL
            </label>
            <Input
              value={meta.resourceUrl}
              onChange={(e) => setMeta((m) => ({ ...m, resourceUrl: e.target.value }))}
              placeholder="https://www.notion.so/..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">상태</label>
            <select
              value={meta.status}
              onChange={(e) => setMeta((m) => ({ ...m, status: e.target.value }))}
              className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            >
              <option value="active">운영중 (수강생 입장 가능)</option>
              <option value="draft">준비중 (입장 불가)</option>
              <option value="closed">종료 (이전 기수)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>회차별 강의</CardTitle>
              <CardDescription>
                Vimeo ID(녹화본) 또는 YouTube 라이브 URL 중 하나를 입력하세요. 둘 다 있으면 Vimeo가
                우선 표시됩니다.
              </CardDescription>
            </div>
            <Button onClick={addSession} variant="outline" size="sm">
              <Plus className="mr-1 h-3 w-3" />
              회차 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              등록된 회차가 없습니다. "회차 추가"로 시작하세요.
            </div>
          ) : (
            sessions.map((s, idx) => (
              <div key={idx} className="rounded-lg border p-4 space-y-3 bg-card">
                <div className="flex items-center gap-2">
                  <div className="w-20">
                    <label className="block text-[10px] font-medium mb-1 text-muted-foreground">
                      회차
                    </label>
                    <Input
                      type="number"
                      value={s.week}
                      onChange={(e) =>
                        updateSession(idx, { week: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium mb-1 text-muted-foreground">
                      제목
                    </label>
                    <Input
                      value={s.title}
                      onChange={(e) => updateSession(idx, { title: e.target.value })}
                    />
                  </div>
                  <div className="w-40">
                    <label className="block text-[10px] font-medium mb-1 text-muted-foreground">
                      날짜
                    </label>
                    <Input
                      value={s.date}
                      onChange={(e) => updateSession(idx, { date: e.target.value })}
                      placeholder="2026-04-15"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSession(idx)}
                    className="self-end text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-medium mb-1 text-muted-foreground">
                      Vimeo ID (녹화본)
                    </label>
                    <Input
                      value={s.vimeoId}
                      onChange={(e) => updateSession(idx, { vimeoId: e.target.value })}
                      placeholder="1186484969"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium mb-1 text-muted-foreground">
                      YouTube 라이브 URL
                    </label>
                    <Input
                      value={s.youtubeLiveUrl}
                      onChange={(e) =>
                        updateSession(idx, { youtubeLiveUrl: e.target.value })
                      }
                      placeholder="https://youtube.com/live/..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-medium mb-1 text-muted-foreground">
                      가이드북 URL (노션 등)
                    </label>
                    <Input
                      value={s.guidebookUrl}
                      onChange={(e) =>
                        updateSession(idx, { guidebookUrl: e.target.value })
                      }
                      placeholder="https://www.notion.so/..."
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={s.secretEnabled}
                      onChange={(e) =>
                        updateSession(idx, { secretEnabled: e.target.checked })
                      }
                    />
                    비밀자료 사용
                  </label>
                  {s.secretEnabled && (
                    <div className="grid gap-3 sm:grid-cols-3 pl-5">
                      <div>
                        <label className="block text-[10px] font-medium mb-1 text-muted-foreground">
                          비밀번호
                        </label>
                        <Input
                          value={s.secretPassword}
                          onChange={(e) =>
                            updateSession(idx, { secretPassword: e.target.value })
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-medium mb-1 text-muted-foreground">
                          노션 URL
                        </label>
                        <Input
                          value={s.secretNotionUrl}
                          onChange={(e) =>
                            updateSession(idx, { secretNotionUrl: e.target.value })
                          }
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-medium mb-1 text-muted-foreground">
                          버튼 라벨 (선택)
                        </label>
                        <Input
                          value={s.secretLabel}
                          onChange={(e) =>
                            updateSession(idx, { secretLabel: e.target.value })
                          }
                          placeholder="비밀 자료 열기"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/manager/classrooms">취소</Link>
        </Button>
        <Button onClick={save} disabled={saving}>
          <Save className="mr-1 h-3 w-3" />
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  )
}
