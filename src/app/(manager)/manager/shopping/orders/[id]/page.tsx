'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/manager/StatusBadge'
import {
  ArrowLeft, Loader2, RotateCcw, XCircle, RefreshCw, ChevronRight, Save, Package,
} from 'lucide-react'

// ── 상수 ─────────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  pending: '결제대기',
  paid: '결제완료',
  preparing: '배송준비중',
  shipping: '배송중',
  delivered: '배송완료',
  cancelled: '취소',
  returned: '반품/교환',
}

const PAYMENT_LABELS: Record<string, string> = {
  card: '신용카드',
  vbank: '가상계좌',
  trans: '계좌이체',
  samsungpay: '삼성페이',
  kakaopay: '카카오페이',
}

// 선형 상태 흐름
const STATUS_FLOW = ['pending', 'paid', 'preparing', 'shipping', 'delivered']

const nextFlowStatus = (s: string) => {
  const idx = STATUS_FLOW.indexOf(s)
  return idx !== -1 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null
}
const prevFlowStatus = (s: string) => {
  const idx = STATUS_FLOW.indexOf(s)
  return idx > 0 ? STATUS_FLOW[idx - 1] : null
}
const canCancel = (s: string) => ['pending', 'paid', 'preparing', 'shipping'].includes(s)
const canReturn = (s: string) => s === 'delivered'
const isTerminal = (s: string) => ['cancelled', 'returned'].includes(s)

// ── 타입 ─────────────────────────────────────────────────────────────────────

interface OrderItem {
  product: any
  quantity: number
  price: number
}

interface ShippingInfo {
  receiverName?: string
  receiverPhone?: string
  address?: string
  memo?: string
  trackingNumber?: string
}

interface Order {
  id: string
  customer: any
  items: OrderItem[]
  status: string
  amount: number
  shippingInfo?: ShippingInfo
  paymentInfo?: { method?: string; transactionID?: string }
  createdAt: string
}

// ── 헬퍼 ─────────────────────────────────────────────────────────────────────

function getProductTitle(product: any): string {
  if (!product) return '(상품 정보 없음)'
  // Polymorphic: { value: {...}, relationTo: '...' }
  if (product.value) return product.value.title ?? '(이름 없음)'
  // Direct object
  return product.title ?? '(이름 없음)'
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between py-1.5 gap-4">
      <span className="text-xs text-slate-400 flex-shrink-0">{label}</span>
      <span className="text-xs text-slate-700 text-right">{value || '-'}</span>
    </div>
  )
}

// ── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [shippingForm, setShippingForm] = useState<ShippingInfo>({})
  const [shippingSaving, setShippingSaving] = useState(false)
  const [shippingDirty, setShippingDirty] = useState(false)

  // ── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`/api/manager/orders/${id}`)
      .then((r) => r.json())
      .then((data: any) => {
        setOrder(data)
        setShippingForm(data.shippingInfo ?? {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  // ── 상태 변경 ─────────────────────────────────────────────────────────────

  const changeStatus = async (nextStatus: string, label: string) => {
    if (!order) return
    if (!confirm(`주문 상태를 "${label}"(으)로 변경하시겠습니까?`)) return

    setActionLoading(true)
    try {
      const res = await fetch(`/api/manager/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      const data = await res.json() as any
      if (res.ok) setOrder(data)
    } finally {
      setActionLoading(false)
    }
  }

  // ── 배송 정보 저장 ────────────────────────────────────────────────────────

  const saveShipping = async () => {
    setShippingSaving(true)
    try {
      const res = await fetch(`/api/manager/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingInfo: shippingForm }),
      })
      const data = await res.json() as any
      if (res.ok) {
        setOrder(data)
        setShippingDirty(false)
      }
    } finally {
      setShippingSaving(false)
    }
  }

  const updateShipping = (key: keyof ShippingInfo, value: string) => {
    setShippingForm((prev) => ({ ...prev, [key]: value }))
    setShippingDirty(true)
  }

  // ── 렌더 ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>주문을 찾을 수 없습니다.</p>
        <button onClick={() => router.back()} className="mt-3 text-sm text-blue-500 hover:underline">
          돌아가기
        </button>
      </div>
    )
  }

  const customer = typeof order.customer === 'object' ? order.customer : null
  const next = nextFlowStatus(order.status)
  const prev = prevFlowStatus(order.status)

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── 헤더 ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        {/* 뒤로 + 주문번호 */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => router.push('/manager/shopping/orders')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs text-slate-400">주문번호</p>
            <p className="font-mono font-bold text-slate-800">{order.id}</p>
          </div>
          <StatusBadge status={order.status} className="ml-2" />
        </div>

        {/* 액션 버튼들 */}
        {!isTerminal(order.status) && (
          <div className="flex flex-wrap items-center gap-2">
            {/* 다음 단계 진행 */}
            {next && (
              <button
                onClick={() => changeStatus(next, STATUS_LABELS[next])}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <ChevronRight size={12} />}
                {STATUS_LABELS[next]}으로 진행
              </button>
            )}

            {/* 거래 되돌리기 */}
            {prev && (
              <button
                onClick={() => changeStatus(prev, STATUS_LABELS[prev])}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={12} />
                거래 되돌리기
              </button>
            )}

            {/* 취소 처리 */}
            {canCancel(order.status) && (
              <button
                onClick={() => changeStatus('cancelled', '취소')}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <XCircle size={12} />
                취소 처리
              </button>
            )}

            {/* 반품 처리 */}
            {canReturn(order.status) && (
              <button
                onClick={() => changeStatus('returned', '반품/교환')}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 border border-orange-200 text-orange-500 text-xs font-medium rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} />
                반품 처리
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── 주문 날짜 ── */}
      <p className="text-xs text-slate-400 mb-6">
        주문일시: {order.createdAt?.slice(0, 16).replace('T', ' ')}
      </p>

      {/* ── 본문 (2컬럼) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 왼쪽: 주문 품목 + 구매자 */}
        <div className="lg:col-span-2 space-y-5">

          {/* 주문 품목 */}
          <InfoCard title="주문 품목">
            {order.items?.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 gap-3 first:pt-0 last:pb-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {getProductTitle(item.product)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.price.toLocaleString()}원 × {item.quantity}개
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">주문 품목 없음</p>
            )}
          </InfoCard>

          {/* 구매자 정보 */}
          <InfoCard title="구매자 정보">
            {customer ? (
              <div className="divide-y divide-slate-50">
                <InfoRow label="이메일" value={customer.email} />
                <InfoRow label="이름" value={customer.nickname || customer.name} />
                <InfoRow label="연락처" value={customer.phone} />
              </div>
            ) : (
              <p className="text-sm text-slate-400">구매자 정보 없음</p>
            )}
          </InfoCard>
        </div>

        {/* 오른쪽: 결제 정보 + 배송지 */}
        <div className="space-y-5">

          {/* 결제 정보 */}
          <InfoCard title="결제 정보">
            <div className="divide-y divide-slate-50">
              <InfoRow
                label="결제수단"
                value={PAYMENT_LABELS[order.paymentInfo?.method ?? ''] ?? order.paymentInfo?.method}
              />
              <InfoRow label="결제금액" value={`${order.amount.toLocaleString()}원`} />
              {order.paymentInfo?.transactionID && (
                <InfoRow label="거래ID" value={order.paymentInfo.transactionID} />
              )}
            </div>
          </InfoCard>

          {/* 배송지 정보 (편집 가능) */}
          <InfoCard title="배송지 정보">
            <div className="space-y-2.5">
              {(
                [
                  { key: 'receiverName', label: '수령인', placeholder: '수령인 이름' },
                  { key: 'receiverPhone', label: '연락처', placeholder: '010-0000-0000' },
                  { key: 'address', label: '주소', placeholder: '배송 주소' },
                  { key: 'memo', label: '배송 메모', placeholder: '배송 메모 (선택)' },
                  { key: 'trackingNumber', label: '운송장번호', placeholder: '운송장 번호 입력' },
                ] as { key: keyof ShippingInfo; label: string; placeholder: string }[]
              ).map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-400 mb-1">{label}</label>
                  <input
                    type="text"
                    value={shippingForm[key] ?? ''}
                    onChange={(e) => updateShipping(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              ))}

              {shippingDirty && (
                <button
                  onClick={saveShipping}
                  disabled={shippingSaving}
                  className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {shippingSaving ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Save size={12} />
                  )}
                  배송 정보 저장
                </button>
              )}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}
