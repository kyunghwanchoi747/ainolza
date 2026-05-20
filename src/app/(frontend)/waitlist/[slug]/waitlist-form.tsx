'use client'

import Link from 'next/link'
import { useState } from 'react'

type Props = {
  productSlug: string
  productName: string
  defaultName: string
  defaultEmail: string
  defaultPhone: string
}

export function WaitlistForm({ productSlug, productName, defaultName, defaultEmail, defaultPhone }: Props) {
  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [phone, setPhone] = useState(defaultPhone)
  const [motivation, setMotivation] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = name.trim() && email.trim() && agreed && !loading

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productSlug,
          buyerName: name.trim(),
          buyerEmail: email.trim(),
          buyerPhone: phone.trim() || undefined,
          motivation: motivation.trim() || undefined,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setError(data.error || `신청 실패 (${res.status})`)
        return
      }
      setDone(true)
    } catch (err) {
      setError((err as Error).message || '네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line p-8 text-center">
        <p className="text-xs tracking-[0.2em] text-brand uppercase mb-3">RECEIVED</p>
        <h2 className="text-xl font-bold text-ink mb-3">대기 신청이 접수되었습니다</h2>
        <p className="text-sm text-sub leading-relaxed mb-6 break-keep">
          {productName} 다음 기수 모집이 시작되면 입력하신 이메일로 가장 먼저 안내드리겠습니다.
          접수 확인 메일이 발송되었으니 받은편지함을 확인해주세요.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-ink text-white text-sm font-semibold hover:bg-black transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm text-ink font-medium mb-1.5">이름 <span className="text-brand">*</span></label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-line rounded-xl text-ink focus:outline-none focus:border-ink transition-colors"
          placeholder="이름"
        />
      </div>

      <div>
        <label className="block text-sm text-ink font-medium mb-1.5">이메일 <span className="text-brand">*</span></label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-line rounded-xl text-ink focus:outline-none focus:border-ink transition-colors"
          placeholder="example@email.com"
        />
        <p className="mt-1.5 text-xs text-sub">모집 안내를 이 주소로 보내드립니다.</p>
      </div>

      <div>
        <label className="block text-sm text-ink font-medium mb-1.5">휴대폰 (선택)</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border border-line rounded-xl text-ink focus:outline-none focus:border-ink transition-colors"
          placeholder="010-0000-0000"
        />
      </div>

      <div>
        <label className="block text-sm text-ink font-medium mb-1.5">신청 동기 (선택)</label>
        <textarea
          rows={3}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          className="w-full px-4 py-3 border border-line rounded-xl text-ink focus:outline-none focus:border-ink transition-colors resize-none"
          placeholder="어떤 점이 궁금하셨는지, 어떤 분야에 활용하고 싶으신지 자유롭게 적어주세요."
        />
      </div>

      <label className="flex items-start gap-2 cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm text-ink leading-relaxed">
          모집 안내를 받기 위해 입력한 이메일·휴대폰을 수집·이용하는 데 동의합니다. <span className="text-brand">*</span>
          <span className="block text-xs text-sub mt-1">
            보유 기간: 모집 안내 발송 후 1년. 안내 메일에 포함된 링크로 언제든 철회할 수 있습니다.
          </span>
        </span>
      </label>

      {error && (
        <p className="text-sm text-brand bg-brand-light p-3 rounded-xl">{error}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={[
          'w-full py-4 rounded-full text-sm font-semibold transition-all',
          canSubmit ? 'bg-ink text-white hover:bg-black' : 'bg-line text-sub cursor-not-allowed',
        ].join(' ')}
      >
        {loading ? '접수 중…' : '대기 신청하기'}
      </button>
    </form>
  )
}
