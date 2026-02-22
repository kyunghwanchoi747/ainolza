'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/manager/DataTable'
import { PageHeader } from '@/components/manager/PageHeader'
import { StatusBadge } from '@/components/manager/StatusBadge'
import { Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'

interface Customer {
  id: number
  nickname?: string
  email: string
  userType: string
  group?: string
  points?: number
  purchaseAmount?: number
  createdAt: string
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{ docs: Customer[]; totalDocs: number; totalPages: number }>({
    docs: [], totalDocs: 0, totalPages: 1,
  })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    const res = await fetch(`/api/manager/customers?${params}`)
    const json = await res.json() as any
    if (json.success) setData({ docs: json.docs, totalDocs: json.totalDocs, totalPages: json.totalPages })
    setLoading(false)
  }

  useEffect(() => { setPage(1) }, [search])
  useEffect(() => { fetchData() }, [page, search])

  const columns: ColumnDef<Customer, any>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ getValue }) => <span className="text-xs text-slate-400">#{getValue()}</span>,
    },
    {
      accessorKey: 'nickname',
      header: '닉네임',
      cell: ({ getValue, row }) => getValue() || <span className="text-slate-400 text-xs">{row.original.email}</span>,
    },
    { accessorKey: 'email', header: '이메일', cell: ({ getValue }) => <span className="text-xs">{getValue()}</span> },
    { accessorKey: 'userType', header: '등급', cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    {
      accessorKey: 'purchaseAmount',
      header: '구매액',
      cell: ({ getValue }) => `${(getValue() ?? 0).toLocaleString()}원`,
    },
    {
      accessorKey: 'createdAt',
      header: '가입일',
      cell: ({ getValue }) => getValue()?.slice(0, 10) ?? '-',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link
          href={`/admin/collections/users/${row.original.id}`}
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
      <PageHeader title="고객 관리" description="회원 목록을 확인하고 관리합니다." />
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="이메일 또는 닉네임 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
