'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function RefundApprovalButton({ orderId, orderNumber }: { orderId: number; orderNumber: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const approve = async () => {
    if (!confirm(`${orderNumber} 주문을 환불 처리하시겠습니까?\n\nPortOne을 통해 카드사 승인 취소가 자동으로 진행됩니다.`)) return

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
      alert('환불이 완료되었습니다. 페이지를 새로고침합니다.')
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
