'use client'
import { useState, useEffect } from 'react'
import { DataTable } from '@/components/manager/DataTable'
import { PageHeader } from '@/components/manager/PageHeader'
import { Star } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
interface Review { id: number; content: string; rating: number; createdAt: string; user?: any }
export default function ReviewsPage() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{ docs: Review[]; totalDocs: number; totalPages: number }>({ docs: [], totalDocs: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const fetchData = async () => {
    setLoading(true)
    const res = await fetch(`/api/manager/reviews?page=${page}&limit=20`)
    const json = await res.json() as any
    if (json.success) setData({ docs: json.docs, totalDocs: json.totalDocs, totalPages: json.totalPages })
    setLoading(false)
  }
  useEffect(() => { fetchData() }, [page])
  const columns: ColumnDef<Review, any>[] = [
    { accessorKey: 'id', header: 'ID', cell: ({ getValue }) => <span className="text-xs text-slate-400">#{getValue()}</span> },
    { accessorKey: 'rating', header: '별점', cell: ({ getValue }) => <div className="flex items-center gap-0.5">{Array.from({length: 5}).map((_, i) => <Star key={i} size={12} className={i < getValue() ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />)}</div> },
    { accessorKey: 'content', header: '내용', cell: ({ getValue }) => <span className="text-sm truncate max-w-xs block">{getValue()}</span> },
    { accessorKey: 'createdAt', header: '작성일', cell: ({ getValue }) => getValue()?.slice(0,10) ?? '-' },
  ]
  return (
    <div>
      <PageHeader title="구매평 관리" description={`총 ${data.totalDocs}건`} />
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        {loading ? <div className="flex items-center justify-center py-12 text-slate-400 text-sm">불러오는 중...</div> :
          <DataTable columns={columns} data={data.docs} totalDocs={data.totalDocs} page={page} totalPages={data.totalPages} onPageChange={setPage} />}
      </div>
    </div>
  )
}
