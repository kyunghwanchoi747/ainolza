'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Metadata } from 'next'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          role: 'user',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        const msg = data?.errors?.[0]?.message || '회원가입에 실패했습니다.'
        setError(msg)
        return
      }

      // 가입 성공 → 자동 로그인
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })

      if (loginRes.ok) {
        router.push('/')
        router.refresh()
      } else {
        router.push('/login')
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#D4756E]">AI놀자</Link>
          <h1 className="text-2xl font-bold text-[#333] mt-4">회원가입</h1>
          <p className="text-[#999] text-sm mt-2">AI놀자와 함께 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">이름</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl text-[#333] placeholder-[#ccc] focus:outline-none focus:border-[#D4756E] transition-colors"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">이메일</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl text-[#333] placeholder-[#ccc] focus:outline-none focus:border-[#D4756E] transition-colors"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">비밀번호</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl text-[#333] placeholder-[#ccc] focus:outline-none focus:border-[#D4756E] transition-colors"
              placeholder="6자 이상"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">비밀번호 확인</label>
            <input
              type="password"
              required
              value={form.passwordConfirm}
              onChange={e => setForm({...form, passwordConfirm: e.target.value})}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl text-[#333] placeholder-[#ccc] focus:outline-none focus:border-[#D4756E] transition-colors"
              placeholder="비밀번호 재입력"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D4756E] text-white font-bold rounded-xl hover:bg-[#c0625b] transition-all disabled:opacity-50"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-sm text-[#999] mt-6">
          이미 계정이 있으신가요? <Link href="/login" className="text-[#D4756E] font-medium hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  )
}
