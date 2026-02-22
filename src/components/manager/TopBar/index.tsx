'use client'

import { Bell, LogOut, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface TopBarProps {
  user: {
    nickname?: string | null
    email: string
  }
  title?: string
}

export function TopBar({ user, title }: TopBarProps) {
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
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <Bell size={16} />
        </button>
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
