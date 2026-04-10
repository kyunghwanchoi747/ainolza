'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetPasswordForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('유효하지 않은 링크입니다. 비밀번호 재설정을 다시 요청해주세요.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (!res.ok) {
        setError('재설정에 실패했습니다. 링크가 만료되었을 수 있습니다.')
        return
      }

      setDone(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-[400px] text-center">
        <div className="text-5xl mb-4">&#10003;</div>
        <h1 className="text-2xl font-bold text-ink mb-4">비밀번호 변경 완료</h1>
        <p className="text-body text-sm mb-8">잠시 후 로그인 페이지로 이동합니다.</p>
        <Link href="/login" className="text-sm text-brand hover:underline">로그인하기</Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-brand">AI놀자</Link>
        <h1 className="text-2xl font-bold text-ink mt-4">새 비밀번호 설정</h1>
        <p className="text-sub text-sm mt-2">새로 사용할 비밀번호를 입력해주세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">새 비밀번호</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-line rounded-xl text-ink placeholder-hint focus:outline-none focus:border-[#D4756E] transition-colors"
            placeholder="6자 이상"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">비밀번호 확인</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full px-4 py-3 border border-line rounded-xl text-ink placeholder-hint focus:outline-none focus:border-[#D4756E] transition-colors"
            placeholder="비밀번호 재입력"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50"
        >
          {loading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </form>

      <p className="text-center text-sm text-sub mt-6">
        <Link href="/login" className="text-brand hover:underline">로그인으로 돌아가기</Link>
      </p>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <Suspense fallback={<div className="text-sub">로딩 중...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
