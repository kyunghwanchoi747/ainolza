'use client'

import { useEffect, useState } from 'react'
import { Video, VideoOff, Copy, ExternalLink } from 'lucide-react'

export default function ManagerMeetingPage() {
  const [meeting, setMeeting] = useState<{
    id: number
    room_name: string
    title: string
    has_password: number
    created_at: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [password, setPassword] = useState('')
  const [working, setWorking] = useState(false)
  const [copied, setCopied] = useState(false)

  async function fetchMeeting() {
    const res = await fetch('/api/meeting')
    const data = (await res.json()) as { meeting: typeof meeting }
    setMeeting(data.meeting)
    setLoading(false)
  }

  useEffect(() => { fetchMeeting() }, [])

  async function openMeeting() {
    if (!title.trim()) return
    setWorking(true)
    try {
      const res = await fetch('/api/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), password: password.trim() || null }),
      })
      if (res.ok) {
        setTitle('')
        setPassword('')
        await fetchMeeting()
      }
    } finally {
      setWorking(false)
    }
  }

  async function closeMeeting() {
    if (!confirm('회의실을 종료하시겠습니까?')) return
    setWorking(true)
    try {
      await fetch('/api/meeting', { method: 'DELETE' })
      await fetchMeeting()
    } finally {
      setWorking(false)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/meeting`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div className="p-8 text-muted-foreground">불러오는 중...</div>
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">회의실 관리</h1>
      <p className="text-muted-foreground text-sm mb-8">Jitsi Meet 기반 화상 회의실을 개설하고 수강생에게 링크를 공유하세요.</p>

      {/* 현재 상태 */}
      {meeting ? (
        <div className="border-2 border-green-300 bg-green-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-bold text-green-700">회의 진행 중</span>
          </div>
          <p className="text-lg font-bold text-ink mb-1">{meeting.title}</p>
          <p className="text-sm text-muted-foreground mb-4">
            개설: {new Date(meeting.created_at).toLocaleString('ko-KR')}
            {meeting.has_password ? ' · 입장 코드 있음' : ' · 입장 코드 없음'}
          </p>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-green-700 font-medium rounded-xl hover:bg-green-50 transition-colors text-sm"
            >
              <Copy className="w-4 h-4" />
              {copied ? '복사됨!' : '수강생 링크 복사'}
            </button>
            <a
              href="/meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-green-700 font-medium rounded-xl hover:bg-green-50 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              수강생 화면 미리보기
            </a>
            <a
              href={`https://meet.jit.si/${meeting.room_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors text-sm"
            >
              <Video className="w-4 h-4" />
              회의실 입장
            </a>
            <button
              onClick={closeMeeting}
              disabled={working}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
            >
              <VideoOff className="w-4 h-4" />
              회의 종료
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-line rounded-2xl p-6 mb-8 text-center">
          <VideoOff className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">현재 열린 회의실이 없습니다.</p>
        </div>
      )}

      {/* 회의 개설 폼 */}
      <div className="border border-line rounded-2xl p-6">
        <h2 className="font-bold text-ink mb-4">새 회의 개설</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">회의 제목 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: 심화반 2회차 라이브 Q&A"
              className="w-full px-4 py-3 border border-line rounded-xl text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              입장 코드 <span className="text-muted-foreground text-xs font-normal">(선택 — 비워두면 누구나 입장 가능)</span>
            </label>
            <input
              type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="입장 코드 (선택)"
              className="w-full px-4 py-3 border border-line rounded-xl text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors"
            />
          </div>
          <button
            onClick={openMeeting}
            disabled={!title.trim() || working}
            className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {working ? '개설 중...' : '회의실 개설'}
          </button>
        </div>
        {meeting && (
          <p className="text-amber-600 text-xs mt-3">※ 새 회의를 개설하면 현재 진행 중인 회의가 자동 종료됩니다.</p>
        )}
      </div>

      <div className="mt-6 p-4 bg-surface rounded-xl text-sm text-muted-foreground">
        <p className="font-medium text-ink mb-1">수강생 입장 링크</p>
        <p className="font-mono text-brand">ainolza.kr/meeting</p>
        <p className="mt-2">수강생은 이 페이지에서 회의가 열려 있을 때 입장 버튼이 활성화됩니다.</p>
      </div>
    </div>
  )
}
