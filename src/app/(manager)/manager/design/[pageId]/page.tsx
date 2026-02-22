'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, use } from 'react'
import { ArrowLeft, Globe, Pencil } from 'lucide-react'
import Link from 'next/link'
import type { Data } from '@puckeditor/core'

const PuckEditor = dynamic(() => import('@/components/manager/PuckEditor'), { ssr: false })

const EMPTY_DATA: Data = { content: [], root: { props: {} } }

interface PageData {
  id: string | number
  title: string
  slug: string
  status: 'draft' | 'published'
  puckData?: Data
}

export default function DesignEditorPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = use(params)
  const [page, setPage] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/manager/pages/${pageId}`)
      .then((r) => r.json())
      .then((data) => {
        setPage(data as PageData)
        setLoading(false)
      })
  }, [pageId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400 text-sm">
        로딩 중...
      </div>
    )
  }

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-slate-400">
        <p className="text-sm">페이지를 찾을 수 없습니다.</p>
        <Link href="/manager/design" className="mt-3 text-sm text-blue-600 hover:underline">
          돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center h-14 px-6 bg-white border-b border-slate-200 shrink-0 gap-4">
        <Link
          href="/manager/design"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={15} />
          목록으로
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Pencil size={13} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{page.title}</p>
            <p className="text-xs text-slate-400 leading-tight">/p/{page.slug}</p>
          </div>
        </div>

        {page.status === 'published' && (
          <a
            href={`/p/${page.slug}`}
            target="_blank"
            className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors"
          >
            <Globe size={13} />
            게시된 페이지 보기
          </a>
        )}
      </div>

      {/* Puck editor fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <PuckEditor
          pageId={pageId}
          initialData={page.puckData ?? EMPTY_DATA}
          onSaved={() => {
            // Refresh page status after save
            fetch(`/api/manager/pages/${pageId}`)
              .then((r) => r.json())
              .then((d) => setPage(d as PageData))
          }}
        />
      </div>
    </div>
  )
}
