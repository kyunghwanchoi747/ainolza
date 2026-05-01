'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, Trash2, ArrowUp, ArrowDown, ExternalLink, Plus, X } from 'lucide-react'

type Review = {
  id: number
  rating: number
  content: string
  siteUrl?: string | null
  displayName?: string | null
  order: number
  createdAt: string
  user?: { name?: string; email?: string } | null
}

export default function ManagerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    displayName: '',
    rating: 5,
    content: '',
    siteUrl: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reviews?where[status][equals]=approved&limit=100', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json() as { docs?: any[] }
        setReviews(
          (data.docs || []).map((d: any) => ({
            id: d.id,
            rating: d.rating,
            content: d.content,
            siteUrl: d.siteUrl || null,
            displayName: d.displayName || null,
            order: d.order ?? 0,
            createdAt: d.createdAt,
            user: typeof d.user === 'object' ? d.user : null,
          })).sort((a: Review, b: Review) => a.order - b.order)
        )
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: number) => {
    if (!confirm('이 후기를 삭제할까요?')) return
    await fetch(`/api/reviews/${id}`, { method: 'DELETE', credentials: 'include' })
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const handleMove = async (index: number, dir: 'up' | 'down') => {
    const next = [...reviews]
    const swapIdx = dir === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= next.length) return

    const tempOrder = next[index].order
    next[index].order = next[swapIdx].order
    next[swapIdx].order = tempOrder;
    [next[index], next[swapIdx]] = [next[swapIdx], next[index]]
    setReviews(next)

    await Promise.all([
      fetch(`/api/reviews/${next[index].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order: next[index].order }),
      }),
      fetch(`/api/reviews/${next[swapIdx].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order: next[swapIdx].order }),
      }),
    ])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.displayName.trim() || !form.content.trim()) {
      alert('이름과 내용을 입력해주세요.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          displayName: form.displayName.trim(),
          rating: Number(form.rating),
          content: form.content.trim(),
          siteUrl: form.siteUrl.trim() || undefined,
          order: 100, // 새로 추가하면 뒤로
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string }
        alert(err.error || '저장에 실패했습니다.')
        return
      }
      setForm({ displayName: '', rating: 5, content: '', siteUrl: '' })
      setShowForm(false)
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">후기 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">홈 화면에 표시되는 순서를 조정하거나 삭제할 수 있습니다.</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? '닫기' : '후기 추가'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-5 rounded-xl border bg-white space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">이름 (홈에는 첫 글자만 노출됨)</label>
              <input
                type="text"
                value={form.displayName}
                onChange={e => setForm({ ...form, displayName: e.target.value })}
                placeholder="예: 김영수"
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">사이트 URL (선택)</label>
              <input
                type="url"
                value={form.siteUrl}
                onChange={e => setForm({ ...form, siteUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-700">별점</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  className="p-1"
                >
                  <Star className={`w-6 h-6 ${n <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-700">후기 내용</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={5}
              placeholder="자연스러운 수강생 후기를 입력하세요."
              className="w-full px-3 py-2 rounded-lg border text-sm resize-y"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-50"
            >
              {submitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm">로딩 중...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>등록된 후기가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r, i) => {
            const name = r.displayName || r.user?.name || r.user?.email?.split('@')[0] || '수강생'
            const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString('ko-KR') : ''
            const isCustom = !!r.displayName && !r.user
            return (
              <div key={r.id} className="flex gap-3 items-start p-4 rounded-xl border bg-white">
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    onClick={() => handleMove(i, 'up')}
                    disabled={i === 0}
                    className="p-1 rounded hover:bg-muted disabled:opacity-20"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(i, 'down')}
                    disabled={i === reviews.length - 1}
                    className="p-1 rounded hover:bg-muted disabled:opacity-20"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm">{name}</span>
                    {isCustom && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium">매니저 작성</span>
                    )}
                    <span className="text-xs text-muted-foreground">{date}</span>
                    <div className="flex gap-0.5 ml-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{r.content}</p>
                  {r.siteUrl && (
                    <a href={r.siteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1">
                      <ExternalLink className="w-3 h-3" />{r.siteUrl}
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
