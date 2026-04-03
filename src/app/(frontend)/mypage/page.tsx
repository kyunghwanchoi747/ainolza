'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Phone, LogOut } from 'lucide-react'

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user)
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#999]">로딩 중...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-3xl font-bold text-[#333] mb-8">마이페이지</h1>

          {/* 프로필 카드 */}
          <div className="p-6 rounded-2xl bg-[#f8f8f8] border border-[#e5e5e5] mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#D4756E]/10 flex items-center justify-center">
                <User className="w-6 h-6 text-[#D4756E]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#333]">{user.name || '회원'}</h2>
                <p className="text-[#999] text-sm">{user.role === 'admin' ? '관리자' : '일반 회원'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#999]" />
                <span className="text-[#666]">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-[#999]" />
                  <span className="text-[#666]">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* 메뉴 */}
          <div className="space-y-2">
            <Link href="/programs/vibe-coding/enroll" className="block p-4 rounded-xl border border-[#e5e5e5] hover:border-[#D4756E]/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#333]">수강 신청</h3>
                  <p className="text-xs text-[#999]">AI 바이브 코딩 클래스 신청하기</p>
                </div>
                <span className="text-[#999]">&rarr;</span>
              </div>
            </Link>

            <Link href="/store" className="block p-4 rounded-xl border border-[#e5e5e5] hover:border-[#D4756E]/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#333]">강의/전자책</h3>
                  <p className="text-xs text-[#999]">구매 가능한 콘텐츠 보기</p>
                </div>
                <span className="text-[#999]">&rarr;</span>
              </div>
            </Link>

            <Link href="/labs" className="block p-4 rounded-xl border border-[#e5e5e5] hover:border-[#D4756E]/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#333]">AI 실험실</h3>
                  <p className="text-xs text-[#999]">무료 AI 체험 프로그램</p>
                </div>
                <span className="text-[#999]">&rarr;</span>
              </div>
            </Link>

            {user.role === 'admin' && (
              <Link href="/manager" className="block p-4 rounded-xl border border-[#D4756E]/20 bg-[#D4756E]/5 hover:bg-[#D4756E]/10 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#D4756E]">관리자 대시보드</h3>
                    <p className="text-xs text-[#D4756E]/60">사이트 관리 페이지</p>
                  </div>
                  <span className="text-[#D4756E]">&rarr;</span>
                </div>
              </Link>
            )}
          </div>

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="w-full mt-8 py-3 border border-[#e5e5e5] rounded-xl text-[#999] hover:text-[#333] hover:border-[#333] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </section>
    </div>
  )
}
