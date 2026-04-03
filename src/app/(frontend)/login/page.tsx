'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#D4756E]">AI놀자</Link>
          <h1 className="text-2xl font-bold text-[#333] mt-4">로그인</h1>
          <p className="text-[#999] text-sm mt-2">AI놀자에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="비밀번호"
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
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-[#999]">
            <Link href="/forgot-password" className="text-[#999] hover:text-[#D4756E] hover:underline">비밀번호를 잊으셨나요?</Link>
          </p>
          <p className="text-sm text-[#999]">
            아직 계정이 없으신가요? <Link href="/signup" className="text-[#D4756E] font-medium hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
