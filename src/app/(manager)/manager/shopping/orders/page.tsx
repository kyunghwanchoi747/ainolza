'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/manager/PageHeader'
import { StatusBadge } from '@/components/manager/StatusBadge'
import { Search, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// ── 상수 ─────────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { value: '', label: '전체', countKey: 'all' },
  { value: 'pending', label: '결제대기', countKey: 'pending' },
  { value: 'paid', label: '결제완료', countKey: 'paid' },
  { value: 'preparing', label: '배송준비중', countKey: 'preparing' },
  { value: 'shipping', label: '배송중', countKey: 'shipping' },
  { value: 'delivered', label: '배송완료', countKey: 'delivered' },
  { value: 'cancelled', label: '취소', countKey: 'cancelled' },
  { value: 'returned', label: '반품/교환', countKey: 'returned' },
]

const PAYMENT_LABELS: Record<string, string> = {
  card: '신용카드',
  vbank: '가상계좌',
  trans: '계좌이체',
  samsungpay: '삼성페이',
  kakaopay: '카카오페이',
}

// ── 타입 ─────────────────────────────────────────────────────────────────────

interface OrderItem {
  product: { value: { title: string }; relationTo: string } | null
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: { nickname?: string; email: string; phone?: string } | string
  items: OrderItem[]
  status: string
  amount: number
  paymentInfo?: { method?: string }
  createdAt: string
}

// ── 주문 목록 ─────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [docs, setDocs] = useState<Order[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0 })
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (statusFilter) params.set('status', statusFilter)
    if (search) params.set('search', search)

    try {
      const res = await fetch(`/api/manager/orders?${params}`)
      const json = await res.json() as any
      if (json.success) {
        setDocs(json.docs ?? [])
        setTotalDocs(json.totalDocs ?? 0)
        setTotalPages(json.totalPages ?? 1)
        if (json.counts) setCounts(json.counts)
      }
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, search])

  useEffect(() => { setPage(1) }, [statusFilter, search])
  useEffect(() => { fetchData() }, [fetchData])

  // ── 헬퍼 ─────────────────────────────────────────────────────────────────

  const getCustomer = (c: Order['customer']) => {
    if (!c) return { name: '-', email: '' }
    if (typeof c === 'string') return { name: c, email: '' }
    return { name: c.nickname || c.email, email: c.email }
  }

  const getItemsSummary = (items: OrderItem[]) => {
    if (!items?.length) return '-'
    const first = items[0]
    const name = (first?.product as any)?.value?.title ?? (first?.product as any)?.title ?? '상품'
    return items.length > 1 ? `${name} 외 ${items.length - 1}개` : name
  }

  // ── 렌더 ─────────────────────────────────────────────────────────────────

  return (
    <div>
      <PageHeader title="주문 관리" description="주문 현황을 확인하고 상태를 관리합니다." />

      {/* 상태 탭 */}
      <div className="flex gap-0 border-b border-slate-200 overflow-x-auto mb-4">
        {STATUS_TABS.map((tab) => {
          const count = counts[tab.countKey] ?? 0
          const active = statusFilter === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                active
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="주문번호 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            불러오는 중...
          </div>
        ) : docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <ShoppingBag size={36} className="opacity-30" />
            <p className="text-sm">주문이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
                  <th className="text-left px-4 py-3 font-semibold">주문 정보</th>
                  <th className="text-left px-4 py-3 font-semibold">구매자</th>
                  <th className="text-left px-4 py-3 font-semibold">상품</th>
                  <th className="text-right px-4 py-3 font-semibold w-[110px]">결제금액</th>
                  <th className="text-left px-4 py-3 font-semibold w-[90px]">결제수단</th>
                  <th className="text-center px-4 py-3 font-semibold w-[100px]">상태</th>
                  <th className="w-[80px]" />
                </tr>
              </thead>
              <tbody>
                {docs.map((order) => {
                  const { name, email } = getCustomer(order.customer)
                  const itemsSummary = getItemsSummary(order.items)
                  const paymentLabel = PAYMENT_LABELS[order.paymentInfo?.method ?? ''] ?? order.paymentInfo?.method ?? '-'

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      {/* 주문 정보 */}
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-blue-600 font-medium">
                          {order.id}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {order.createdAt?.slice(0, 16).replace('T', ' ')}
                        </p>
                      </td>

                      {/* 구매자 */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 text-xs">{name}</p>
                        {email && name !== email && (
                          <p className="text-xs text-slate-400 mt-0.5">{email}</p>
                        )}
                      </td>

                      {/* 상품 요약 */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-slate-600 line-clamp-2 max-w-[200px]">
                          {itemsSummary}
                        </p>
                      </td>

                      {/* 결제금액 */}
                      <td className="px-4 py-3 text-right font-medium text-slate-800">
                        {order.amount.toLocaleString()}원
                      </td>

                      {/* 결제수단 */}
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {paymentLabel}
                      </td>

                      {/* 상태 */}
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* 상세보기 */}
                      <td className="px-3 py-3 text-right">
                        <Link
                          href={`/manager/shopping/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 hover:underline font-medium"
                        >
                          상세 <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
            <span>총 {totalDocs}건</span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2.5 py-1 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                이전
              </button>
              <span className="px-3">{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
