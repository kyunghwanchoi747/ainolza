'use client'

import { useEffect, useState } from 'react'

type Props = {
  orderId: string
  orderNumber: string
  amount: number
  initialDepositorName: string
  vbankDate?: string
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return '마감'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function BankInfoClient({ orderId, amount, initialDepositorName, vbankDate }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [depositorName, setDepositorName] = useState(initialDepositorName)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialDepositorName)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const expiry = vbankDate ? new Date(vbankDate).getTime() : null
  const remaining = expiry ? expiry - now : null
  const remainingText = remaining != null ? formatRemaining(remaining) : '24:00:00'
  const expired = remaining != null && remaining <= 0

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const saveDepositor = async () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      alert('입금자명을 입력해 주세요.')
      return
    }
    if (trimmed === depositorName) {
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/depositor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ depositorName: trimmed }),
      })
      if (!res.ok) throw new Error()
      setDepositorName(trimmed)
      setEditing(false)
    } catch {
      alert('변경에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-2 py-5 border-t border-line">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-base font-bold text-ink">입금 계좌</h2>
        <span className={`text-xs ${expired ? 'text-sub' : 'text-ink'}`}>
          {expired ? '입금 마감' : `남은 시간 ${remainingText}`}
        </span>
      </div>

      <div className="space-y-3.5">
        <Row
          label="은행"
          value="토스뱅크"
          onCopy={() => copy('토스뱅크', 'bank')}
          copied={copied === 'bank'}
        />
        <Row
          label="계좌번호"
          value="1000-1041-3507"
          onCopy={() => copy('100010413507', 'account')}
          copied={copied === 'account'}
          mono
          emphasize
        />
        <Row
          label="예금주"
          value="최경환"
          onCopy={() => copy('최경환', 'holder')}
          copied={copied === 'holder'}
        />
        <Row
          label="입금 금액"
          value={`${amount.toLocaleString()}원`}
          onCopy={() => copy(String(amount), 'amount')}
          copied={copied === 'amount'}
          emphasize
        />

        {/* 입금자명 — 수정 가능 */}
        <div className="pt-2 border-t border-line">
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <span className="text-sm text-sub">입금자명</span>
            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setDraft(depositorName)
                  setEditing(true)
                }}
                className="text-xs text-sub underline hover:text-ink"
              >
                수정
              </button>
            )}
          </div>
          {editing ? (
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={20}
                placeholder="입금하실 분 이름"
                className="flex-1 px-3 py-2 border border-line focus:border-ink focus:outline-none text-base"
                autoFocus
              />
              <button
                type="button"
                onClick={saveDepositor}
                disabled={saving}
                className="px-4 py-2 bg-ink text-white text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
              >
                {saving ? '저장 중' : '저장'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setDraft(depositorName)
                }}
                disabled={saving}
                className="px-3 py-2 border border-line text-sm text-sub hover:text-ink"
              >
                취소
              </button>
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-base font-medium text-ink">{depositorName || '미설정'}</span>
              <button
                type="button"
                onClick={() => copy(depositorName, 'depositor')}
                className="text-xs text-sub underline hover:text-ink"
              >
                {copied === 'depositor' ? '복사됨' : '복사'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  onCopy,
  copied,
  mono,
  emphasize,
}: {
  label: string
  value: string
  onCopy: () => void
  copied: boolean
  mono?: boolean
  emphasize?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-sub shrink-0">{label}</span>
      <div className="flex items-baseline gap-3 flex-1 justify-end">
        <span
          className={`${emphasize ? 'text-lg font-bold' : 'font-medium'} ${
            mono ? 'font-mono' : ''
          } text-ink`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="text-xs text-sub underline hover:text-ink shrink-0"
        >
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
    </div>
  )
}
