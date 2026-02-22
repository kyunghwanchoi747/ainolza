'use client'

import { useState, useEffect } from 'react'
import { Bell, CheckCheck, User, ShoppingCart, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/manager/cn'
import { PageHeader } from '@/components/manager/PageHeader'

interface Notification {
  id: number | string
  type: 'user_signup' | 'new_order' | 'new_inquiry'
  title: string
  body?: string
  isRead: boolean
  href?: string
  createdAt: string
}

const TYPE_TABS = [
  { value: '', label: '전체' },
  { value: 'user_signup', label: '회원가입' },
  { value: 'new_order', label: '신규 주문' },
  { value: 'new_inquiry', label: '문의' },
]

const TYPE_ICON: Record<string, React.ReactNode> = {
  user_signup: <User size={14} className="text-blue-500" />,
  new_order: <ShoppingCart size={14} className="text-green-500" />,
  new_inquiry: <MessageCircle size={14} className="text-orange-500" />,
}

const TYPE_BG: Record<string, string> = {
  user_signup: 'bg-blue-50',
  new_order: 'bg-green-50',
  new_inquiry: 'bg-orange-50',
}

const TYPE_LABEL: Record<string, string> = {
  user_signup: '회원가입',
  new_order: '신규 주문',
  new_inquiry: '신규 문의',
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return '방금 전'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export default function NotificationsPage() {
  const [filterType, setFilterType] = useState('')
  const [data, setData] = useState<Notification[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  async function fetchData(p = page, type = filterType) {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), limit: '30' })
    if (type) params.set('type', type)
    const res = await fetch(`/api/manager/notifications?${params}`)
    const json = await res.json() as any
    if (json.success) {
      setData(json.docs)
      setTotalDocs(json.totalDocs)
      setTotalPages(json.totalPages ?? 1)
      setUnreadCount(json.docs.filter((n: Notification) => !n.isRead).length)
    }
    setLoading(false)
  }

  useEffect(() => {
    setPage(1)
    fetchData(1, filterType)
  }, [filterType])

  useEffect(() => {
    fetchData(page, filterType)
  }, [page])

  async function markAllRead() {
    await fetch('/api/manager/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    })
    setData((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  async function markRead(id: string | number) {
    await fetch('/api/manager/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setData((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  return (
    <div>
      <PageHeader
        title="알림"
        description={`전체 ${totalDocs}건${unreadCount > 0 ? ` · 읽지 않음 ${unreadCount}건` : ''}`}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <CheckCheck size={13} />
              모두 읽음
            </button>
          ) : undefined
        }
      />

      <div className="bg-white rounded-xl border border-slate-200">
        {/* Type filter tabs */}
        <div className="flex gap-0 border-b border-slate-200 overflow-x-auto">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterType(tab.value)}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                filterType === tab.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
              불러오는 중...
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Bell size={32} className="mb-3 opacity-20" />
              <p className="text-sm">알림이 없습니다.</p>
            </div>
          ) : (
            data.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer',
                  !n.isRead && 'bg-blue-50/30',
                )}
                onClick={() => {
                  if (!n.isRead) markRead(n.id)
                  if (n.href) window.location.href = n.href
                }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                    TYPE_BG[n.type] ?? 'bg-slate-100',
                  )}
                >
                  {TYPE_ICON[n.type] ?? <Bell size={14} className="text-slate-400" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {TYPE_LABEL[n.type] ?? n.type}
                    </span>
                    {!n.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-sm mt-0.5',
                      !n.isRead ? 'font-semibold text-slate-800' : 'text-slate-600',
                    )}
                  >
                    {n.body || n.title}
                  </p>
                </div>

                {/* Time */}
                <span className="text-xs text-slate-400 shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-slate-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            <span className="text-xs text-slate-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
