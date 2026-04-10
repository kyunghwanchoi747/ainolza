'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        setError('요청 처리에 실패했습니다. 이메일을 확인해주세요.')
        return
      }

      setSent(true)
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-[400px] text-center">
          <div className="text-5xl mb-4">&#9993;</div>
          <h1 className="text-2xl font-bold text-ink mb-4">이메일을 확인해주세요</h1>
          <p className="text-body text-sm mb-2">
            <strong>{email}</strong>으로 비밀번호 재설정 링크를 보냈습니다.
          </p>
          <p className="text-sub text-xs mb-8">
            메일이 도착하지 않았다면 스팸함을 확인해주세요.
          </p>
          <Link href="/login" className="text-sm text-brand hover:underline">
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand">AI놀자</Link>
          <h1 className="text-2xl font-bold text-ink mt-4">비밀번호 재설정</h1>
          <p className="text-sub text-sm mt-2">가입한 이메일을 입력하면 재설정 링크를 보내드립니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-line rounded-xl text-ink placeholder-hint focus:outline-none focus:border-[#D4756E] transition-colors"
              placeholder="example@email.com"
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
            {loading ? '전송 중...' : '재설정 링크 보내기'}
          </button>
        </form>

        <p className="text-center text-sm text-sub mt-6">
          <Link href="/login" className="text-brand hover:underline">로그인으로 돌아가기</Link>
        </p>
      </div>
    </div>
  )
}
