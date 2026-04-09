'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type User = {
  id: number
  email: string
  name?: string
}

type Classroom = {
  slug: string
  label: string
}

const CLASSROOM_OPTIONS: Classroom[] = [
  { slug: 'vibe-coding-101', label: '바이브 코딩 101 (입문)' },
  { slug: 'vibe-coding-advanced', label: '바이브 코딩 심화' },
]

export default function AccessGrantPage() {
  const [emailQuery, setEmailQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedSlug, setSelectedSlug] = useState<string>('vibe-coding-advanced')
  const [granting, setGranting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [grantedHistory, setGrantedHistory] = useState<{ orderId: number; email: string; classroom: string }[]>([])

  // 이메일 검색
  useEffect(() => {
    if (emailQuery.trim().length < 2) {
      setResults([])
      return
    }
    const handle = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `/api/users?where[email][contains]=${encodeURIComponent(emailQuery.trim())}&limit=10`,
          { credentials: 'include' },
        )
        const data = (await res.json()) as { docs?: User[] }
        setResults(data.docs || [])
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(handle)
  }, [emailQuery])

  const grant = async () => {
    if (!selectedUser || !selectedSlug) {
      setMessage({ type: 'error', text: '회원과 강의실을 선택해주세요.' })
      return
    }
    setGranting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/manager/grant-classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: selectedUser.id, classroomSlug: selectedSlug }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        already?: boolean
        message?: string
        error?: string
        orderId?: number
      }
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || '권한 부여 실패' })
        return
      }
      setMessage({
        type: 'success',
        text: data.already
          ? `${selectedUser.email} 은(는) 이미 ${CLASSROOM_OPTIONS.find((c) => c.slug === selectedSlug)?.label} 권한이 있습니다.`
          : data.message || '권한이 부여되었습니다.',
      })
      if (data.orderId && !data.already) {
        setGrantedHistory((h) => [
          {
            orderId: data.orderId,
            email: selectedUser.email,
            classroom: CLASSROOM_OPTIONS.find((c) => c.slug === selectedSlug)?.label || selectedSlug,
          },
          ...h,
        ])
      }
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message })
    } finally {
      setGranting(false)
    }
  }

  const revoke = async (orderId: number) => {
    if (!confirm('이 권한을 회수하시겠습니까? (테스트 주문이 삭제됩니다)')) return
    try {
      const res = await fetch(`/api/manager/grant-classroom?orderId=${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setGrantedHistory((h) => h.filter((x) => x.orderId !== orderId))
        setMessage({ type: 'success', text: '권한이 회수되었습니다.' })
      } else {
        setMessage({ type: 'error', text: '회수 실패' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">강의실 권한 부여</h1>
        <p className="text-muted-foreground mt-1">
          테스트용으로 특정 회원에게 강의실 액세스 권한을 부여합니다. 내부적으로 amount=0인
          테스트 주문(`paid` 상태)을 생성하므로 매출 통계에는 영향을 주지 않습니다 (필터링 권장).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. 회원 선택</CardTitle>
          <CardDescription>이메일 일부를 입력해 회원을 검색하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            placeholder="이메일 검색 (예: gmail)"
          />
          {searching && <p className="text-sm text-muted-foreground">검색 중...</p>}
          {results.length > 0 && (
            <div className="border rounded-md divide-y max-h-64 overflow-auto">
              {results.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                    selectedUser?.id === u.id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{u.email}</p>
                      {u.name && <p className="text-xs text-muted-foreground">{u.name}</p>}
                    </div>
                    {selectedUser?.id === u.id && <Badge>선택됨</Badge>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {selectedUser && (
            <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium">선택된 회원</p>
              <p className="text-sm text-muted-foreground">
                {selectedUser.name && `${selectedUser.name} · `}
                {selectedUser.email} (id: {selectedUser.id})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. 강의실 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {CLASSROOM_OPTIONS.map((c) => (
              <label
                key={c.slug}
                className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50 ${
                  selectedSlug === c.slug ? 'bg-primary/5 border-primary' : ''
                }`}
              >
                <input
                  type="radio"
                  name="classroom"
                  value={c.slug}
                  checked={selectedSlug === c.slug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                />
                <span className="text-sm font-medium">{c.label}</span>
                <span className="text-xs text-muted-foreground ml-auto">{c.slug}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. 권한 부여</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={grant} disabled={granting || !selectedUser}>
            {granting ? '처리 중...' : '권한 부여하기'}
          </Button>
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>

      {grantedHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>이번 세션에서 부여한 권한</CardTitle>
            <CardDescription>회수 버튼으로 즉시 해제할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {grantedHistory.map((g) => (
                <div
                  key={g.orderId}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="text-sm">
                    <span className="font-medium">{g.email}</span>
                    <span className="text-muted-foreground"> · {g.classroom}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => revoke(g.orderId)}>
                    회수
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
