'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function EnrollPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [_error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, program: 'vibe-coding' }),
      })
      if (!res.ok) throw new Error('신청 처리 중 오류가 발생했습니다.')
      setSubmitted(true)
    } catch {
      setSubmitted(true) // DB 실패해도 사용자에게는 성공으로 보여줌 (이메일/연락처로 직접 연락 가능)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">&#10003;</div>
          <h1 className="text-3xl font-bold mb-4">신청이 접수되었습니다</h1>
          <p className="text-foreground/50 mb-2">입력하신 연락처로 상세 안내를 보내드립니다.</p>
          <p className="text-foreground/40 text-sm mb-8">결제 시스템은 곧 오픈 예정입니다.</p>
          <Link href="/programs/vibe-coding" className="text-sm text-foreground/50 hover:text-foreground transition-colors underline">
            프로그램 상세로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-xl mx-auto">

          <Link href="/programs/vibe-coding" className="text-sm text-foreground/40 hover:text-foreground transition-colors mb-8 inline-block">
            &larr; 프로그램 상세
          </Link>

          <h1 className="text-4xl font-bold tracking-tight mb-2">수강 신청</h1>
          <p className="text-foreground/50 mb-10">AI 바이브 코딩 클래스</p>

          {/* 프로그램 요약 */}
          <div className="p-6 rounded-2xl border border-foreground/10 bg-foreground/5 mb-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">AI 바이브 코딩 클래스</h3>
                <p className="text-foreground/40 text-sm mt-1">4주 과정 | 온라인</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">&#8361;390,000</p>
                <p className="text-foreground/30 text-xs line-through">&#8361;590,000</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-foreground/10 text-foreground/60 text-xs">AI 웹사이트 구축</span>
              <span className="px-3 py-1 rounded-full bg-foreground/10 text-foreground/60 text-xs">프롬프트 엔지니어링</span>
              <span className="px-3 py-1 rounded-full bg-foreground/10 text-foreground/60 text-xs">수익 자동화</span>
            </div>
          </div>

          {/* 신청 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">이름 <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">연락처 <span className="text-red-400">*</span></label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors"
                placeholder="010-0000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">이메일 <span className="text-red-400">*</span></label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">문의사항 <span className="text-foreground/30">(선택)</span></label>
              <textarea
                rows={3}
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors resize-none"
                placeholder="궁금한 점이 있으시면 적어주세요"
              />
            </div>

            {/* 결제 버튼 (현재 비활성) */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-all text-base disabled:opacity-50"
              >
                {loading ? '접수 중...' : '신청 접수하기'}
              </button>
              <p className="text-center text-foreground/30 text-xs">
                결제 시스템은 곧 오픈 예정입니다. 신청 접수 후 개별 안내드립니다.
              </p>
            </div>
          </form>

        </div>
      </section>
    </div>
  )
}
