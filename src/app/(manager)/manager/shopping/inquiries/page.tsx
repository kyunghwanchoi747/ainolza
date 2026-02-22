'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/manager/PageHeader'
import { StatusBadge } from '@/components/manager/StatusBadge'
import { EmptyState } from '@/components/manager/EmptyState'
import { ChevronDown, ChevronRight, Send } from 'lucide-react'
import { cn } from '@/lib/manager/cn'

const STATUS_TABS = [
  { value: '', label: '전체' },
  { value: 'pending', label: '미답변' },
  { value: 'answered', label: '답변완료' },
]

interface Inquiry {
  id: number
  subject: string
  message: string
  status: string
  answer?: string
  createdAt: string
  user?: { nickname?: string; email: string } | string
}

export default function InquiriesPage() {
  const [filterStatus, setFilterStatus] = useState('pending')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Inquiry[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (filterStatus) params.set('status', filterStatus)
    const res = await fetch(`/api/manager/inquiries?${params}`)
    const json = await res.json() as any
    if (json.success) { setData(json.docs); setTotalDocs(json.totalDocs) }
    setLoading(false)
  }

  useEffect(() => { setPage(1) }, [filterStatus])
  useEffect(() => { fetchData() }, [page, filterStatus])

  const handleExpand = (id: number) => {
    const item = data.find((i) => i.id === id)
    setAnswerText(item?.answer ?? '')
    setExpanded(expanded === id ? null : id)
  }

  const handleAnswer = async (id: number) => {
    setSaving(true)
    await fetch('/api/manager/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, answer: answerText }),
    })
    setSaving(false)
    setExpanded(null)
    fetchData()
  }

  return (
    <div>
      <PageHeader title="문의 관리" description={`총 ${totalDocs}건`} />
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex gap-0 border-b border-slate-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                filterStatus === tab.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 text-sm">불러오는 중...</div>
          ) : data.length === 0 ? (
            <EmptyState title="문의 없음" description="해당 조건의 문의가 없습니다." />
          ) : (
            data.map((inquiry) => (
              <div key={inquiry.id}>
                <button
                  onClick={() => handleExpand(inquiry.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                >
                  {expanded === inquiry.id ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{inquiry.subject}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {typeof inquiry.user === 'object' ? (inquiry.user?.nickname || inquiry.user?.email) : inquiry.user} · {inquiry.createdAt?.slice(0, 10)}
                    </p>
                  </div>
                  <StatusBadge status={inquiry.status} />
                </button>
                {expanded === inquiry.id && (
                  <div className="px-5 pb-5 bg-slate-50">
                    <div className="bg-white rounded-lg p-4 mb-3 text-sm text-slate-700 border border-slate-200">
                      {inquiry.message}
                    </div>
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="답변을 입력하세요..."
                      rows={4}
                      className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleAnswer(inquiry.id)}
                        disabled={saving || !answerText.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Send size={13} /> {saving ? '저장 중...' : '답변 저장'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
