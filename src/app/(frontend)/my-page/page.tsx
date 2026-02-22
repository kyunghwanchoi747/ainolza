import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import {
  User,
  Package,
  FileText,
  MessageCircle,
  Settings,
  CreditCard,
  Bookmark,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'

export default async function MyPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login')
  }

  const stats = [
    { label: '구매 내역', icon: Package, value: '0', color: 'text-blue-500' },
    { label: '작성한 글', icon: FileText, value: '0', color: 'text-purple-500' },
    { label: '작성한 댓글', icon: MessageCircle, value: '0', color: 'text-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Profile Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl shadow-blue-500/20">
                <User className="h-14 w-14 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-black text-white tracking-tight">
                {user.nickname || '나만의 닉네임'}
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                BASIC MEMBER
              </p>

              <div className="mt-8 flex flex-col gap-2">
                <button className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95">
                  <Settings className="h-4 w-4" />
                  계정 설정
                </button>
              </div>
            </div>

            <nav className="rounded-[2.5rem] border border-white/10 bg-white/5 p-4 space-y-1">
              {[
                { label: '수강 내역', icon: Bookmark, href: '#' },
                { label: '결제 내역', icon: CreditCard, href: '#' },
                { label: '내 활동 관리', icon: FileText, href: '#' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-gray-400 transition-all hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <button className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-red-400 transition-all hover:bg-red-500/5">
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </nav>
          </aside>

          {/* Dashboard Content */}
          <main className="flex-grow space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:border-blue-500/30 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-2xl bg-white/5 p-3 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-black text-white">{stat.value}</span>
                  </div>
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  최근 수강 중인 강의
                </h3>
                <button className="text-xs font-bold text-blue-400 hover:underline">
                  전체보기
                </button>
              </div>
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Bookmark className="h-8 w-8 opacity-20" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest">
                  수강 중인 강의가 없습니다.
                </p>
                <Link
                  href="/courses"
                  className="mt-4 text-xs font-bold text-blue-400 border border-blue-400/30 px-6 py-2 rounded-full hover:bg-blue-400/10"
                >
                  추천 강의 보러가기
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
