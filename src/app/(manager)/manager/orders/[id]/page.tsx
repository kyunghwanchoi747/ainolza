'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const statusOptions = [
  { value: 'pending', label: '주문접수', color: '#F59E0B' },
  { value: 'paid', label: '결제완료', color: '#10B981' },
  { value: 'active', label: '이용중', color: '#3B82F6' },
  { value: 'completed', label: '완료', color: '#6B7280' },
  { value: 'refund_requested', label: '환불요청', color: '#EF4444' },
  { value: 'refunded', label: '환불완료', color: '#9CA3AF' },
  { value: 'failed', label: '결제실패', color: '#EF4444' },
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
                <div className="flex justify-between"><span className="text-muted-foreground">가상계좌</span><span>{order.vbankName} {order.vbankNum}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">입금기한</span><span>{order.vbankDate ? new Date(order.vbankDate).toLocaleString('ko-KR') : '-'}</span></div>
              </>
            )}
            <div className="flex justify-between"><span className="text-muted-foreground">현금영수증</span><span>{order.cashReceiptType === 'none' ? '미발행' : order.cashReceiptType === 'income' ? '소득공제용' : order.cashReceiptType === 'expense' ? '지출증빙용' : '-'}</span></div>
          </div>
        </div>

        {/* 환불 정보 */}
        {(order.refundReason || order.status === 'refund_requested' || order.status === 'refunded') && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 space-y-4">
            <h2 className="font-bold text-lg text-red-600">환불 정보</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">환불 사유:</span> <span>{order.refundReason || '-'}</span></div>
              {order.refundAmount && <div className="flex justify-between"><span className="text-muted-foreground">환불 금액</span><span>{order.refundAmount?.toLocaleString()}원</span></div>}
              {order.refundedAt && <div className="flex justify-between"><span className="text-muted-foreground">환불일</span><span>{new Date(order.refundedAt).toLocaleDateString('ko-KR')}</span></div>}
            </div>
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
