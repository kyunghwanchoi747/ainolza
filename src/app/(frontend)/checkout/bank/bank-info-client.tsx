'use client'

import { useEffect, useState } from 'react'

type Props = {
  orderNumber: string
  amount: number
  depositorName: string
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

export function BankInfoClient({ orderNumber, amount, depositorName, vbankDate }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())

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
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    }
  }

  return (
    <div className="p-5 rounded-2xl border-2 border-blue-300 bg-blue-50 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-blue-900">입금 정보</h2>
        <div className={`text-sm font-bold ${expired ? 'text-gray-500' : 'text-red-600'}`}>
          {expired ? '입금 마감' : `남은 시간 ${remainingText}`}
        </div>
      </div>

      <Field
        label="은행"
        value="토스뱅크"
        onCopy={() => copy('토스뱅크', 'bank')}
        copied={copied === 'bank'}
      />
      <Field
        label="계좌번호"
        value="1000-1041-3507"
        big
        onCopy={() => copy('100010413507', 'account')}
        copied={copied === 'account'}
      />
      <Field
        label="예금주"
        value="최경환"
        onCopy={() => copy('최경환', 'holder')}
        copied={copied === 'holder'}
      />
      <Field
        label="입금자명 ★"
        value={depositorName}
        highlight
        onCopy={() => copy(depositorName, 'depositor')}
        copied={copied === 'depositor'}
      />
      <Field
        label="입금 금액"
        value={`${amount.toLocaleString()}원`}
        big
        onCopy={() => copy(String(amount), 'amount')}
        copied={copied === 'amount'}
      />

      <div className="text-xs text-blue-800 pt-2 border-t border-blue-200">
        주문번호: <span className="font-mono">{orderNumber}</span>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  big,
  highlight,
  onCopy,
  copied,
}: {
  label: string
  value: string
  big?: boolean
  highlight?: boolean
  onCopy: () => void
  copied: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-blue-900 shrink-0 w-24">{label}</div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <span
          className={`${big ? 'text-xl font-extrabold' : 'font-bold'} ${
            highlight ? 'text-red-600' : 'text-blue-900'
          }`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="text-xs px-2 py-1 rounded-md bg-white border border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
    </div>
  )
}
