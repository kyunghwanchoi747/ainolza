'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  orderId: number
  orderNumber: string
  pgProvider?: string | null
}

export function RefundApprovalButton({ orderId, orderNumber, pgProvider }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const isTest = orderNumber.startsWith('TEST_')
  const isDirectBank = pgProvider === 'direct-bank'

  const buildConfirmMessage = () => {
    if (isTest) {
      return `${orderNumber} 주문을 환불 처리하시겠습니까?\n\n테스트 주문 — 상태만 변경되며 실제 결제 취소는 진행되지 않습니다.`
    }
    if (isDirectBank) {
      return `${orderNumber} 주문을 환불 처리하시겠습니까?\n\n이 주문은 무통장 입금 건입니다. 환불 승인 후 입금받은 금액을 구매자 계좌로 직접 송금해 주세요. (PortOne 자동 취소 안 함)`
    }
    return `${orderNumber} 주문을 환불 처리하시겠습니까?\n\nPortOne을 통해 카드사 승인 취소가 자동으로 진행됩니다.`
  }

  const approve = async () => {
    if (!confirm(buildConfirmMessage())) return

    const reason = prompt('환불 사유 (선택)') || undefined

    setLoading(true)
    try {
      const res = await fetch('/api/manager/approve-refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId, reason }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) {
        alert(data.error || '환불 처리 실패')
        return
      }
      const successMsg = isDirectBank
        ? '환불 상태로 변경했습니다. 토스뱅크에서 구매자에게 환불금을 송금해 주세요.'
        : '환불이 완료되었습니다. 페이지를 새로고침합니다.'
      alert(successMsg)
      setDone(true)
      window.location.reload()
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={(e) => {
        e.stopPropagation()
        approve()
      }}
      disabled={loading || done}
    >
      {loading ? '처리 중...' : done ? '완료' : '환불 승인'}
    </Button>
  )
}
