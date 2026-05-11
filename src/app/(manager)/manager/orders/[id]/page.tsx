'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RefundApprovalButton } from '@/components/manager/refund-approval-button'

const statusOptions = [
  { value: 'pending', label: '주문접수', color: '#F59E0B' },
  { value: 'paid', label: '결제완료', color: '#10B981' },
  { value: 'active', label: '이용중', color: '#3B82F6' },
  { value: 'completed', label: '완료', color: '#6B7280' },
  { value: 'refund_requested', label: '환불요청', color: '#EF4444' },
  { value: 'refunded', label: '환불완료', color: '#9CA3AF' },
  { value: 'failed', label: '결제실패', color: '#EF4444' },
  { value: 'cancel_requested', label: '취소요청', color: '#F59E0B' },
  { value: 'cancelled', label: '취소', color: '#9CA3AF' },
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [memo, setMemo] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch(`/api/users/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(async (userData: any) => {
        if (!userData?.user || userData.user.role !== 'admin') {
          router.push('/login')
          return
        }
        // Payload REST API로 주문 조회
        const res = await fetch(`/api/orders/${params.id}`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json() as any
          setOrder(data)
          setMemo(data.adminMemo || '')
          setStatus(data.status || 'pending')
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [params.id, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, adminMemo: memo }),
      })
      alert('저장되었습니다.')
    } catch {
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  // 회원이 요청한 주문 취소를 승인 — status: cancel_requested → cancelled
  const handleApproveCancel = async () => {
    if (!confirm('이 주문의 취소 요청을 승인하시겠습니까?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'cancelled' }),
      })
      if (!res.ok) throw new Error()
      alert('취소 승인 처리 완료.')
      setStatus('cancelled')
      setOrder({ ...order, status: 'cancelled' })
    } catch {
      alert('처리에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  // 무통장 [입금확인] — status를 paid로 즉시 전환. afterChange hook이
  // 권한 부여 + 결제완료 메일 발송까지 자동 처리.
  const handleConfirmDeposit = async () => {
    if (!confirm('이 주문을 입금 확인 처리하시겠습니까? 강의실 권한 부여와 결제완료 메일이 자동 발송됩니다.')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'paid' }),
      })
      if (!res.ok) throw new Error()
      alert('입금 확인 처리 완료.')
      setStatus('paid')
      setOrder({ ...order, status: 'paid' })
    } catch {
      alert('처리에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">로딩 중...</div>
  if (!order) return <div className="p-8 text-center text-muted-foreground">주문을 찾을 수 없습니다.</div>

  const st = statusOptions.find(s => s.value === order.status)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/manager/orders" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">주문 상세</h1>
          <p className="text-muted-foreground text-sm font-mono">{order.orderNumber}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 주문 정보 */}
        <div className="rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-lg">주문 정보</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">상품명</span><span className="font-medium">{order.productName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">상품 유형</span><span>{order.productType || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">결제금액</span><span className="font-bold text-lg">{order.amount?.toLocaleString()}원</span></div>
            {order.originalAmount && order.originalAmount !== order.amount && (
              <div className="flex justify-between"><span className="text-muted-foreground">정가</span><span className="line-through text-muted-foreground">{order.originalAmount?.toLocaleString()}원</span></div>
            )}
            <div className="flex justify-between"><span className="text-muted-foreground">결제수단</span><span>{order.payMethod || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">주문일시</span><span>{order.createdAt ? new Date(order.createdAt).toLocaleString('ko-KR') : '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">결제일시</span><span>{order.paidAt ? new Date(order.paidAt).toLocaleString('ko-KR') : '-'}</span></div>
          </div>
        </div>

        {/* 구매자 정보 */}
        <div className="rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-lg">구매자 정보</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">이름</span><span className="font-medium">{order.buyerName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">이메일</span><span>{order.buyerEmail}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">연락처</span><span>{order.buyerPhone || '-'}</span></div>
          </div>
        </div>

        {/* PG 정보 */}
        <div className="rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-lg">결제 정보</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">PortOne UID</span><span className="font-mono text-xs">{order.impUid || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Merchant UID</span><span className="font-mono text-xs">{order.merchantUid || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">PG사</span><span>{order.pgProvider || '-'}</span></div>
            {order.receiptUrl && (
              <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 underline">영수증 보기</a>
            )}
            {order.vbankName && (
              <>
                <div className="flex justify-between"><span className="text-muted-foreground">{order.pgProvider === 'direct-bank' ? '입금 계좌' : '가상계좌'}</span><span>{order.vbankName} {order.vbankNum}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">입금기한</span><span>{order.vbankDate ? new Date(order.vbankDate).toLocaleString('ko-KR') : '-'}</span></div>
              </>
            )}
            {order.pgProvider === 'direct-bank' && (
              <div className="flex justify-between items-baseline py-2 border-t border-line mt-1">
                <span className="text-sm font-bold text-ink">입금자명</span>
                <span className="text-base font-bold text-ink">{order.depositorName || order.buyerName || '미설정'}</span>
              </div>
            )}
            {order.pgProvider === 'direct-bank' && order.status === 'pending' && (
              <button
                onClick={handleConfirmDeposit}
                disabled={saving}
                className="w-full mt-3 px-4 py-3 bg-ink hover:bg-ink/90 text-white font-bold rounded-md disabled:opacity-50"
              >
                {saving ? '처리 중...' : '입금 확인 → 결제완료 처리'}
              </button>
            )}
            {order.status === 'cancel_requested' && (
              <button
                onClick={handleApproveCancel}
                disabled={saving}
                className="w-full mt-3 px-4 py-3 border border-ink text-ink hover:bg-ink hover:text-white font-bold rounded-md disabled:opacity-50 transition"
              >
                {saving ? '처리 중...' : '취소 요청 승인 → 주문 취소 처리'}
              </button>
            )}
            <div className="flex justify-between"><span className="text-muted-foreground">현금영수증</span><span>{order.cashReceiptType === 'none' ? '미발행' : order.cashReceiptType === 'income' ? '소득공제용' : order.cashReceiptType === 'expense' ? '지출증빙용' : '-'}</span></div>
          </div>
        </div>

        {/* 환불 정보 */}
        {(order.refundReason || order.status === 'refund_requested' || order.status === 'refunded') && (
          <div className="rounded-xl border p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-lg">환불 정보</h2>
              {order.status === 'refund_requested' && (
                <RefundApprovalButton orderId={order.id} orderNumber={order.orderNumber} pgProvider={order.pgProvider} />
              )}
              {order.status === 'refunded' && (
                <span className="text-xs font-medium px-3 py-1 rounded-md bg-gray-100 text-gray-600">환불 완료</span>
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">환불 사유:</span> <span>{order.refundReason || '-'}</span></div>
              {order.refundAmount && <div className="flex justify-between"><span className="text-muted-foreground">환불 금액</span><span>{order.refundAmount?.toLocaleString()}원</span></div>}
              {order.refundedAt && <div className="flex justify-between"><span className="text-muted-foreground">환불일</span><span>{new Date(order.refundedAt).toLocaleDateString('ko-KR')}</span></div>}
              {order.pgProvider === 'direct-bank' && (order.refundBank || order.refundAccountNum || order.refundAccountHolder) && (
                <div className="pt-3 border-t space-y-2">
                  <div className="text-xs font-bold text-ink">환불 받을 계좌 (회원 입력)</div>
                  <div className="flex justify-between"><span className="text-muted-foreground">은행</span><span className="font-medium">{order.refundBank || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">계좌번호</span><span className="font-mono">{order.refundAccountNum || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">예금주</span><span className="font-medium">{order.refundAccountHolder || '-'}</span></div>
                </div>
              )}
            </div>
            {order.status === 'refund_requested' && (
              <p className="text-xs text-muted-foreground leading-relaxed pt-3 border-t">
                {order.pgProvider === 'direct-bank'
                  ? '이 주문은 무통장 입금 건입니다. [환불 승인] 후 입금받은 금액을 구매자 계좌로 직접 송금해 주세요. (PortOne 자동 취소 안 함)'
                  : '[환불 승인] 클릭 시 PortOne을 통해 카드사 승인 취소가 자동 진행됩니다.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 상태 변경 + 메모 */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="font-bold text-lg">관리</h2>

        <div>
          <label className="block text-sm font-medium mb-2">주문 상태</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500"
          >
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">관리자 메모</label>
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
            placeholder="내부 메모를 남겨주세요..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50"
        >
          {saving ? '저장 중...' : '변경사항 저장'}
        </button>
      </div>
    </div>
  )
}
