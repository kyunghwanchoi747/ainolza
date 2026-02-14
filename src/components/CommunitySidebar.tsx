import React from 'react'
import Link from 'next/link'
import { User, PenSquare, Bell, ChevronRight } from 'lucide-react'
import type { Category } from '@/payload-types'

interface CommunitySidebarProps {
  categories: { docs: Category[] }
}

export function CommunitySidebar({ categories }: CommunitySidebarProps) {
  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-72">
      {/* My Profile Synopsis */}
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-tighter">Guest User</p>
            <Link href="/login" className="text-[10px] text-blue-400 font-bold hover:underline">
              로그인이 필요합니다
            </Link>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 border-t border-white/5 pt-6 text-center">
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-bold">내 글</p>
            <p className="text-sm font-black text-white">0</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-bold">댓글</p>
            <p className="text-sm font-black text-white">0</p>
          </div>
        </div>
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95">
          <PenSquare className="h-4 w-4" />
          카페 글쓰기
        </button>
      </div>

      {/* Boards Navigation */}
      <div className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden">
        <div className="bg-white/5 px-6 py-4 border-b border-white/10">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Bell className="h-3 w-3 text-blue-500" />
            게시판 목록
          </h2>
        </div>
        <nav className="p-2 space-y-1">
          <Link
            href="/community"
            className="flex items-center justify-between rounded-xl bg-blue-600/20 px-4 py-3 text-sm font-bold text-blue-400"
          >
            전체글보기
            <ChevronRight className="h-4 w-4" />
          </Link>
          {categories.docs.map((cat: Category) => (
            <Link
              key={cat.id}
              href={`/community?category=${cat.slug}`}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white"
            >
              {cat.title}
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
