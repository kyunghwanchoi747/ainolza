'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', name: '', phone: '' })
  const [error, setError] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [loading, setLoading] = useState(false)

  // 이메일 중복 체크 (디바운스)
  const checkEmail = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailStatus('idle')
      return
    }
    setEmailStatus('checking')
    try {
      const res = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json() as { exists: boolean }
      setEmailStatus(data.exists ? 'taken' : 'available')
    } catch {
      setEmailStatus('idle')
    }
  }, [])

  // 이메일 입력 시 디바운스 체크
  let emailTimer: ReturnType<typeof setTimeout>
  const handleEmailChange = (email: string) => {
    setForm(prev => ({ ...prev, email }))
    clearTimeout(emailTimer)
    emailTimer = setTimeout(() => checkEmail(email), 500)
  }

  // 전화번호 형식 자동 변환
  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 유효성 검증
    if (form.name.trim().length < 2) {
      setError('이름은 2자 이상 입력해주세요.')
      return
    }
    if (!form.email.includes('@') || !form.email.includes('.')) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }
    if (emailStatus === 'taken') {
      setError('이미 가입된 이메일입니다.')
      return
    }
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
          name: form.name.trim(),
          phone: form.phone,
          role: 'user',
        }),
      })

      if (!res.ok) {
        const data = await res.json() as { errors?: Array<{ message?: string }> }
        const msg = data?.errors?.[0]?.message || '회원가입에 실패했습니다.'
        if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('already')) {
          setError('이미 가입된 이메일입니다.')
        } else {
          setError(msg)
        }
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
            <label className="block text-sm font-medium text-[#333] mb-1">이름 <span className="text-[#D4756E]">*</span></label>
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
            <label className="block text-sm font-medium text-[#333] mb-1">이메일 <span className="text-[#D4756E]">*</span></label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => handleEmailChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl text-[#333] placeholder-[#ccc] focus:outline-none transition-colors ${
                emailStatus === 'taken' ? 'border-red-400 focus:border-red-400' :
                emailStatus === 'available' ? 'border-green-400 focus:border-green-400' :
                'border-[#e5e5e5] focus:border-[#D4756E]'
              }`}
              placeholder="example@email.com"
            />
            {emailStatus === 'checking' && <p className="text-xs text-[#999] mt-1">확인 중...</p>}
            {emailStatus === 'taken' && <p className="text-xs text-red-500 mt-1">이미 가입된 이메일입니다.</p>}
            {emailStatus === 'available' && <p className="text-xs text-green-500 mt-1">사용 가능한 이메일입니다.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">연락처 <span className="text-[#999] text-xs">(선택)</span></label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({...form, phone: formatPhone(e.target.value)})}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl text-[#333] placeholder-[#ccc] focus:outline-none focus:border-[#D4756E] transition-colors"
              placeholder="010-0000-0000"
              maxLength={13}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">비밀번호 <span className="text-[#D4756E]">*</span></label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl text-[#333] placeholder-[#ccc] focus:outline-none focus:border-[#D4756E] transition-colors"
              placeholder="6자 이상"
            />
            {form.password && form.password.length < 6 && (
              <p className="text-xs text-[#999] mt-1">비밀번호는 6자 이상이어야 합니다.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">비밀번호 확인 <span className="text-[#D4756E]">*</span></label>
            <input
              type="password"
              required
              value={form.passwordConfirm}
              onChange={e => setForm({...form, passwordConfirm: e.target.value})}
              className={`w-full px-4 py-3 border rounded-xl text-[#333] placeholder-[#ccc] focus:outline-none transition-colors ${
                form.passwordConfirm && form.password !== form.passwordConfirm ? 'border-red-400' :
                form.passwordConfirm && form.password === form.passwordConfirm ? 'border-green-400' :
                'border-[#e5e5e5] focus:border-[#D4756E]'
              }`}
              placeholder="비밀번호 재입력"
            />
            {form.passwordConfirm && form.password !== form.passwordConfirm && (
              <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
            {form.passwordConfirm && form.password === form.passwordConfirm && (
              <p className="text-xs text-green-500 mt-1">비밀번호가 일치합니다.</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || emailStatus === 'taken'}
            className="w-full py-3 bg-[#D4756E] text-white font-bold rounded-xl hover:bg-[#c0625b] transition-all disabled:opacity-50"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>

          <p className="text-xs text-[#999] text-center leading-relaxed">
            가입 시 <button type="button" className="underline">이용약관</button> 및 <button type="button" className="underline">개인정보처리방침</button>에 동의하게 됩니다.
          </p>
        </form>

        <p className="text-center text-sm text-[#999] mt-6">
          이미 계정이 있으신가요? <Link href="/login" className="text-[#D4756E] font-medium hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  )
}
