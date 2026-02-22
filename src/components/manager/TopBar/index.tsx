'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, LogOut, ExternalLink, CheckCheck, User, ShoppingCart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: number | string
  type: 'user_signup' | 'new_order' | 'new_inquiry'
  title: string
  body?: string
  isRead: boolean
  href?: string
  createdAt: string
}

interface TopBarProps {
  user: {
    nickname?: string | null
    email: string
  }
  title?: string
  unreadNotifications?: number
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

const TYPE_ICON: Record<string, React.ReactNode> = {
  user_signup: <User size={13} className="text-blue-500" />,
  new_order: <ShoppingCart size={13} className="text-green-500" />,
  new_inquiry: <MessageCircle size={13} className="text-orange-500" />,
}

const TYPE_BG: Record<string, string> = {
  user_signup: 'bg-blue-50',
  new_order: 'bg-green-50',
  new_inquiry: 'bg-orange-50',
}

export function TopBar({ user, title, unreadNotifications: initialUnread = 0 }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(initialUnread)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function fetchNotifications() {
    setLoading(true)
    try {
      const res = await fetch('/api/manager/notifications?limit=10')
      const data = await res.json() as { docs?: Notification[] }
      if (data.docs) {
        setNotifications(data.docs)
        setUnread(data.docs.filter((n: Notification) => !n.isRead).length)
      }
    } finally {
      setLoading(false)
    }
  }

  function handleBellClick() {
    const next = !open
    setOpen(next)
    if (next) fetchNotifications()
  }

  async function markAllRead() {
    await fetch('/api/manager/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnread(0)
  }

  async function markRead(id: string | number) {
    await fetch('/api/manager/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    setUnread((prev) => Math.max(0, prev - 1))
  }

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        {title && <h1 className="text-sm font-semibold text-slate-700">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ExternalLink size={13} />
          Payload Admin
        </Link>

        {/* Bell with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleBellClick}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="알림"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-800">알림</span>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <CheckCheck size={12} />
                    모두 읽음
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50">
                {loading ? (
                  <div className="py-10 text-center text-xs text-slate-400">로딩 중...</div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400">
                    <Bell size={20} className="mx-auto mb-2 opacity-30" />
                    새 알림이 없습니다.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/40' : ''}`}
                      onClick={() => {
                        if (!n.isRead) markRead(n.id)
                        if (n.href) {
                          window.location.href = n.href
                          setOpen(false)
                        }
                      }}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${TYPE_BG[n.type] ?? 'bg-slate-100'}`}
                      >
                        {TYPE_ICON[n.type] ?? <Bell size={13} className="text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{n.body}</p>
                        )}
                        <p className="text-[10px] text-slate-300 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <Link
                href="/manager/notifications"
                className="block text-center text-xs text-slate-500 hover:text-blue-600 py-3 border-t border-slate-100 transition-colors bg-slate-50/50 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                전체 알림 보기
              </Link>
            </div>
          )}
        </div>

        {/* User area */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {(user.nickname || user.email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-slate-700">{user.nickname || user.email}</p>
          </div>
          <form action="/api/manager/logout" method="POST">
            <button
              type="submit"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="로그아웃"
            >
              <LogOut size={14} />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
