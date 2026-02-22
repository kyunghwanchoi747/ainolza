'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const INQUIRY_TYPES = [
  '강의 관련 문의',
  '결제/환불 문의',
  '커뮤니티 이용 문의',
  '기타 일반 문의',
]

export function InquiryForm() {
  const router = useRouter()
  const [type, setType] = useState(INQUIRY_TYPES[0])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      setError('제목과 내용을 입력해 주세요.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: `[${type}] ${subject}`, message }),
      })
      if (res.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent('/inquiry')}`)
        return
      }
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error || '문의 전송에 실패했습니다.')
        return
      }
      setSuccess(true)
      setSubject('')
      setMessage('')
    } catch {
      setError('문의 전송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl flex flex-col items-center justify-center gap-4 py-16">
        <CheckCircle className="h-12 w-12 text-green-400" />
        <h3 className="text-xl font-black text-white">문의가 접수되었습니다!</h3>
        <p className="text-gray-400 text-sm text-center">
          빠른 시일 내에 답변 드리겠습니다.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 px-6 py-2 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors"
        >
          새 문의 작성
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl space-y-8"
    >
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
          문의 유형
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/50 px-6 py-4 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors appearance-none"
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
          문의 제목
        </label>
        <input
          type="text"
          placeholder="제목을 입력해 주세요"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/50 px-6 py-4 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
          required
        />
      </div>

      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
          문의 내용
        </label>
        <textarea
          rows={6}
          placeholder="상세 내용을 입력해 주세요. (가급적 구체적으로 적어주시면 빠른 답변이 가능합니다.)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-3xl border border-white/10 bg-black/50 px-6 py-4 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
          required
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-5 text-sm font-black text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
        {loading ? '전송 중...' : '문의 내용 전송하기'}
      </button>
    </form>
  )
}
