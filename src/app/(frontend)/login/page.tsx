'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmail, setShowEmail] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })

      if (!res.ok) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-bold text-brand">AI놀자</Link>
          <h1 className="text-2xl font-extrabold text-ink mt-4">로그인</h1>
          <p className="text-sub text-sm mt-2">AI놀자에 오신 것을 환영합니다</p>
        </div>

        {/* 소셜 로그인 */}
        <div className="space-y-3 mb-6">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/google"
            className="w-full py-4 border-2 border-line rounded-xl text-ink font-bold hover:bg-surface hover:border-ink/20 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google로 로그인
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/naver"
            className="w-full py-4 bg-[#03C75A] rounded-xl text-white font-bold hover:bg-[#02b350] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#fff" d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>
            네이버로 로그인
          </a>
        </div>

        {/* 이메일 로그인 토글 */}
        {!showEmail ? (
          <button
            type="button"
            onClick={() => setShowEmail(true)}
            className="w-full py-3 text-sm text-sub hover:text-ink transition-colors cursor-pointer"
          >
            이메일로 로그인하기
          </button>
        ) : (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-line"></div></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-sub">이메일 로그인</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">이메일</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-3 border border-line rounded-xl text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">비밀번호</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full px-4 py-3 border border-line rounded-xl text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors"
                  placeholder="비밀번호"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>

              <p className="text-center text-sm text-sub">
                <Link href="/forgot-password" className="text-sub hover:text-brand hover:underline">비밀번호를 잊으셨나요?</Link>
              </p>
            </form>
          </>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-sub">
            아직 계정이 없으신가요? <Link href="/signup" className="text-brand font-medium hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
