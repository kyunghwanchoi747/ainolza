'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/manager/DataTable'
import { PageHeader } from '@/components/manager/PageHeader'
import { StatusBadge } from '@/components/manager/StatusBadge'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/manager/cn'

const STATUS_TABS = [
  { value: '', label: '전체' },
  { value: 'pending', label: '신규주문' },
  { value: 'paid', label: '결제완료' },
  { value: 'preparing', label: '준비중' },
  { value: 'shipping', label: '배송중' },
  { value: 'delivered', label: '배송완료' },
  { value: 'cancelled', label: '취소' },
]

interface Order {
  id: string
  customer: { nickname?: string; email: string } | string
  status: string
  amount: number
  createdAt: string
}

export default function OrdersPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{ docs: Order[]; totalDocs: number; totalPages: number }>({
    docs: [],
    totalDocs: 0,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (status) params.set('status', status)
    const res = await fetch(`/api/manager/orders?${params}`)
    const json = await res.json() as any
    if (json.success) setData({ docs: json.docs, totalDocs: json.totalDocs, totalPages: json.totalPages })
    setLoading(false)
  }

  useEffect(() => { setPage(1) }, [status])
  useEffect(() => { fetchData() }, [page, status])

  const columns: ColumnDef<Order, any>[] = [
    {
      accessorKey: 'id',
      header: '주문번호',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-slate-500">{String(getValue()).slice(0, 8)}…</span>
      ),
    },
    {
      accessorKey: 'customer',
      header: '고객',
      cell: ({ getValue }) => {
        const c = getValue()
        if (!c) return '-'
        if (typeof c === 'string') return c
        return c.nickname || c.email
      },
    },
    { accessorKey: 'amount', header: '금액', cell: ({ getValue }) => `${Number(getValue()).toLocaleString()}원` },
    { accessorKey: 'status', header: '상태', cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    {
      accessorKey: 'createdAt',
      header: '주문일',
      cell: ({ getValue }) => getValue()?.slice(0, 10) ?? '-',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link
          href={`/admin/collections/orders/${row.original.id}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
        >
          상세 <ExternalLink size={10} />
        </Link>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="주문 관리" description="주문 현황을 확인하고 상태를 관리합니다." />
      <div className="bg-white rounded-xl border border-slate-200">
        {/* Status tabs */}
        <div className="flex gap-0 border-b border-slate-200 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                status === tab.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
              불러오는 중...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data.docs}
              totalDocs={data.totalDocs}
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  )
}
