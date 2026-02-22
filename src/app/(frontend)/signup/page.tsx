'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { BrandLogo } from '@/components/BrandLogo'

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { refreshUser } = useCart()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          nickname: form.nickname || undefined,
        }),
        credentials: 'include',
      })

      if (!createRes.ok) {
        const data = (await createRes.json().catch(() => ({}))) as { message?: string }
        setError(data.message || '회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.')
        return
      }

      // Auto-login after signup
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
        credentials: 'include',
      })

      if (loginRes.ok) {
        await refreshUser()
        router.push('/my-page')
        router.refresh()
      } else {
        router.push('/login')
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const pwMatch = form.password && form.passwordConfirm && form.password === form.passwordConfirm

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-20">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <BrandLogo />
          </div>
          <h1 className="text-3xl font-black text-white">회원가입</h1>
          <p className="mt-2 text-sm text-gray-500">AI 놀자와 함께 성장하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500 focus:bg-white/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
              닉네임 <span className="text-gray-700 normal-case">(선택)</span>
            </label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              placeholder="사용할 닉네임"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500 focus:bg-white/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
              비밀번호 <span className="text-gray-700 normal-case">(8자 이상)</span>
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="비밀번호 입력"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 pr-12 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500 focus:bg-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                required
                placeholder="비밀번호 재입력"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 pr-12 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500 focus:bg-white/10"
              />
              {pwMatch && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white py-4 text-sm font-black text-black transition-all hover:bg-blue-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-600">이미 계정이 있으신가요? </span>
          <Link href="/login" className="font-bold text-blue-400 hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
