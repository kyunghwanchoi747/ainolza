'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'

type Review = {
  id: number
  rating: number
  content: string
  siteUrl?: string
  order: number
  createdAt: string
  user?: { name?: string; email?: string } | null
}

export default function ManagerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

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

    // 순서 값 교환
    const tempOrder = next[index].order
    next[index].order = next[swapIdx].order
    next[swapIdx].order = tempOrder;
    // 배열 위치도 교환
    [next[index], next[swapIdx]] = [next[swapIdx], next[index]]
    setReviews(next)

    // 두 항목 모두 저장
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

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">후기 관리</h1>
        <p className="text-sm text-muted-foreground mt-1">홈 화면에 표시되는 순서를 조정하거나 삭제할 수 있습니다.</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">로딩 중...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>등록된 후기가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r, i) => {
            const name = r.user?.name || r.user?.email?.split('@')[0] || '수강생'
            const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString('ko-KR') : ''
            return (
              <div key={r.id} className="flex gap-3 items-start p-4 rounded-xl border bg-white">
                {/* 순서 조절 */}
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

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{name}</span>
                    <span className="text-xs text-muted-foreground">{date}</span>
                    <div className="flex gap-0.5 ml-1">
                      {[1,2,3,4,5].map(n => (
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

                {/* 삭제 */}
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
