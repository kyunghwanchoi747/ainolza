'use client'

import { useEffect, useState } from 'react'

type Props = {
  open: boolean
  orderId: string
  orderNumber: string
  amount: number
  isDirectBank: boolean
  onClose: () => void
  onDone: () => void
}

export function RefundRequestModal({
  open,
  orderId,
  orderNumber,
  amount,
  isDirectBank,
  onClose,
  onDone,
}: Props) {
  const [reason, setReason] = useState('')
  const [bank, setBank] = useState('')
  const [accountNum, setAccountNum] = useState('')
  const [holder, setHolder] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setReason('')
      setBank('')
      setAccountNum('')
      setHolder('')
      setSubmitting(false)
    }
  }, [open])

  if (!open) return null

  const submit = async () => {
    if (!reason.trim()) {
      alert('환불 사유를 입력해주세요.')
      return
    }
    if (isDirectBank) {
      if (!bank.trim() || !accountNum.trim() || !holder.trim()) {
        alert('환불받을 은행, 계좌번호, 예금주를 모두 입력해주세요.')
        return
      }
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          reason: reason.trim(),
          ...(isDirectBank
            ? {
                refundBank: bank.trim(),
                refundAccountNum: accountNum.replace(/[\s-]/g, ''),
                refundAccountHolder: holder.trim(),
              }
            : {}),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        alert(data.error || '환불 요청에 실패했습니다.')
        return
      }
      alert('환불 요청이 접수되었습니다.')
      onDone()
    } catch {
      alert('오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-line">
          <h2 className="text-lg font-bold text-ink">환불 신청</h2>
          <p className="text-xs text-sub mt-1">
            {orderNumber} · {amount.toLocaleString()}원
          </p>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-sm text-ink mb-2">환불 사유</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="환불을 신청하시는 이유를 입력해주세요"
              className="w-full px-3 py-2 border border-line focus:border-ink focus:outline-none text-sm resize-none"
            />
          </div>

          {isDirectBank && (
            <>
              <div className="pt-3 border-t border-line">
                <p className="text-xs text-sub mb-3 leading-relaxed">
                  무통장 입금 결제 건은 환불받으실 계좌 정보가 필요합니다.
                  관리자 승인 후 입력하신 계좌로 송금됩니다.
                </p>
              </div>
              <div>
                <label className="block text-sm text-ink mb-2">은행</label>
                <input
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  placeholder="예: 토스뱅크 / 국민은행"
                  maxLength={20}
                  className="w-full px-3 py-2 border border-line focus:border-ink focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-ink mb-2">계좌번호</label>
                <input
                  value={accountNum}
                  onChange={(e) => setAccountNum(e.target.value.replace(/[^\d-]/g, ''))}
                  placeholder="숫자만 입력"
                  inputMode="numeric"
                  maxLength={25}
                  className="w-full px-3 py-2 border border-line focus:border-ink focus:outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-ink mb-2">예금주</label>
                <input
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                  placeholder="계좌 명의자"
                  maxLength={20}
                  className="w-full px-3 py-2 border border-line focus:border-ink focus:outline-none text-sm"
                />
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-line flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm text-sub hover:text-ink"
          >
            취소
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="px-5 py-2 bg-ink text-white text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
          >
            {submitting ? '요청 중' : '환불 신청'}
          </button>
        </div>
      </div>
    </div>
  )
}
