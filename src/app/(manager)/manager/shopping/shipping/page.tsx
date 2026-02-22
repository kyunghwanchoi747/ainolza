'use client'
import { useState, useEffect } from 'react'
import { DataTable } from '@/components/manager/DataTable'
import { PageHeader } from '@/components/manager/PageHeader'
import { StatusBadge } from '@/components/manager/StatusBadge'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
interface Order { id: string; customer: any; status: string; amount: number; createdAt: string }
export default function ShippingPage() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{ docs: Order[]; totalDocs: number; totalPages: number }>({ docs: [], totalDocs: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await fetch(`/api/manager/orders?status=preparing&page=${page}&limit=20`)
      const json = await res.json() as any
      if (json.success) setData({ docs: json.docs, totalDocs: json.totalDocs, totalPages: json.totalPages })
      setLoading(false)
    }
    fetchData()
  }, [page])
  const columns: ColumnDef<Order, any>[] = [
    { accessorKey: 'id', header: '주문번호', cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue()).slice(0,8)}…</span> },
    { accessorKey: 'customer', header: '고객', cell: ({ getValue }) => { const c = getValue(); if (!c) return '-'; if (typeof c === 'string') return c; return c.nickname || c.email } },
    { accessorKey: 'amount', header: '금액', cell: ({ getValue }) => `${Number(getValue()).toLocaleString()}원` },
    { accessorKey: 'status', header: '상태', cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    { accessorKey: 'createdAt', header: '주문일', cell: ({ getValue }) => getValue()?.slice(0,10) ?? '-' },
    { id: 'actions', header: '', cell: ({ row }) => <Link href={`/admin/collections/orders/${row.original.id}`} target="_blank" className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline">상세 <ExternalLink size={10} /></Link> },
  ]
  return (
    <div>
      <PageHeader title="배송 관리" description="준비중 상태의 주문을 확인합니다." />
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        {loading ? <div className="flex items-center justify-center py-12 text-slate-400 text-sm">불러오는 중...</div> :
          <DataTable columns={columns} data={data.docs} totalDocs={data.totalDocs} page={page} totalPages={data.totalPages} onPageChange={setPage} />}
      </div>
    </div>
  )
}
