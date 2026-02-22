'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/manager/DataTable'
import { PageHeader } from '@/components/manager/PageHeader'
import { StatusBadge } from '@/components/manager/StatusBadge'
import { Search, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'

interface Product {
  id: number
  title: string
  price: number
  stock: number
  status: string
  createdAt: string
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{ docs: Product[]; totalDocs: number; totalPages: number }>({
    docs: [], totalDocs: 0, totalPages: 1,
  })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    const res = await fetch(`/api/manager/products?${params}`)
    const json = await res.json() as any
    if (json.success) setData({ docs: json.docs, totalDocs: json.totalDocs, totalPages: json.totalPages })
    setLoading(false)
  }

  useEffect(() => { setPage(1) }, [search])
  useEffect(() => { fetchData() }, [page, search])

  const columns: ColumnDef<Product, any>[] = [
    { accessorKey: 'id', header: 'ID', cell: ({ getValue }) => <span className="text-xs text-slate-400">#{getValue()}</span> },
    { accessorKey: 'title', header: '상품명', cell: ({ getValue }) => <span className="font-medium">{getValue()}</span> },
    { accessorKey: 'price', header: '가격', cell: ({ getValue }) => `${Number(getValue()).toLocaleString()}원` },
    { accessorKey: 'stock', header: '재고', cell: ({ getValue }) => {
      const v = Number(getValue())
      return <span className={v === 0 ? 'text-red-500 font-medium' : ''}>{v}</span>
    }},
    { accessorKey: 'status', header: '상태', cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link
          href={`/admin/collections/products/${row.original.id}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
        >
          편집 <ExternalLink size={10} />
        </Link>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="상품 관리"
        actions={
          <Link
            href="/admin/collections/products/create"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} /> 상품 추가
          </Link>
        }
      />
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="상품명 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 text-sm">불러오는 중...</div>
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
  )
}
