'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/manager/PageHeader'
import { StatusBadge } from '@/components/manager/StatusBadge'
import { ProductDrawer, type ProductDoc } from '@/components/manager/ProductDrawer'
import { Search, Plus, Pencil, Trash2, Package } from 'lucide-react'

// ── 상태 탭 정의 ────────────────────────────────────────────────────────────
const STATUS_TABS = [
  { value: '', label: '전체', countKey: 'all' },
  { value: 'published', label: '판매중', countKey: 'published' },
  { value: 'sold_out', label: '품절', countKey: 'sold_out' },
  { value: 'hidden', label: '숨김', countKey: 'hidden' },
] as const

// ── 인라인 상태 변경 드롭다운 ────────────────────────────────────────────────
function StatusSelect({ productId, value, onChange }: {
  productId: number
  value: string
  onChange: (id: number, status: string) => void
}) {
  const [saving, setSaving] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value
    setSaving(true)
    try {
      await fetch(`/api/manager/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      onChange(productId, next)
    } finally {
      setSaving(false)
    }
  }

  const colorMap: Record<string, string> = {
    published: 'text-green-700 bg-green-50 border-green-200',
    sold_out: 'text-orange-700 bg-orange-50 border-orange-200',
    hidden: 'text-slate-600 bg-slate-50 border-slate-200',
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={saving}
      className={`text-xs font-medium border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-60 ${colorMap[value] ?? 'bg-white border-slate-200'}`}
    >
      <option value="published">판매중</option>
      <option value="sold_out">품절</option>
      <option value="hidden">숨김</option>
    </select>
  )
}

// ── 삭제 확인 다이얼로그 ─────────────────────────────────────────────────────
function DeleteDialog({ product, onConfirm, onCancel }: {
  product: ProductDoc
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
        <h3 className="font-bold text-slate-800 mb-2">상품 삭제</h3>
        <p className="text-sm text-slate-500 mb-5">
          <strong className="text-slate-700">{product.title}</strong>을(를) 삭제하시겠습니까?<br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [docs, setDocs] = useState<ProductDoc[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [counts, setCounts] = useState({ all: 0, published: 0, sold_out: 0, hidden: 0 })
  const [loading, setLoading] = useState(true)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductDoc | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProductDoc | null>(null)

  // ── 데이터 Fetch ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (statusFilter) params.set('status', statusFilter)
    if (search) params.set('search', search)

    try {
      const res = await fetch(`/api/manager/products?${params}`)
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

  // ── 핸들러 ────────────────────────────────────────────────────────────────
  const handleStatusChange = (id: number, status: string) => {
    setDocs((prev) => prev.map((p) => p.id === id ? { ...p, status } : p))
    setCounts((prev) => {
      const target = docs.find((p) => p.id === id)
      if (!target) return prev
      const next = { ...prev }
      if (target.status === 'published') next.published = Math.max(0, next.published - 1)
      if (target.status === 'sold_out') next.sold_out = Math.max(0, next.sold_out - 1)
      if (target.status === 'hidden') next.hidden = Math.max(0, next.hidden - 1)
      if (status === 'published') next.published += 1
      if (status === 'sold_out') next.sold_out += 1
      if (status === 'hidden') next.hidden += 1
      return next
    })
  }

  const handleSaved = () => {
    setDrawerOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await fetch(`/api/manager/products/${deleteTarget.id}`, { method: 'DELETE' })
    setDeleteTarget(null)
    fetchData()
  }

  const openCreate = () => {
    setEditProduct(null)
    setDrawerOpen(true)
  }

  const openEdit = (product: ProductDoc) => {
    setEditProduct(product)
    setDrawerOpen(true)
  }

  // ── 렌더링 ────────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="상품 관리"
        description="상품을 등록하고 판매 현황을 관리합니다."
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} /> 상품 등록
          </button>
        }
      />

      {/* 상태 탭 */}
      <div className="flex gap-0.5 mb-4 border-b border-slate-200">
        {STATUS_TABS.map((tab) => {
          const count = counts[tab.countKey as keyof typeof counts] ?? 0
          const active = statusFilter === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="상품명 검색"
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
            <Package size={36} className="opacity-30" />
            <p className="text-sm">등록된 상품이 없습니다.</p>
            <button onClick={openCreate} className="text-xs text-blue-500 hover:underline">
              첫 상품 등록하기
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
                  <th className="text-left px-4 py-3 font-semibold w-[60px]">번호</th>
                  <th className="text-left px-4 py-3 font-semibold">상품명</th>
                  <th className="text-right px-4 py-3 font-semibold w-[100px]">판매가</th>
                  <th className="text-center px-4 py-3 font-semibold w-[100px]">상태</th>
                  <th className="text-center px-4 py-3 font-semibold w-[70px]">재고</th>
                  <th className="text-left px-4 py-3 font-semibold w-[100px]">카테고리</th>
                  <th className="text-left px-4 py-3 font-semibold w-[90px]">등록일</th>
                  <th className="w-[72px]" />
                </tr>
              </thead>
              <tbody>
                {docs.map((product) => {
                  const thumbnail = product.images?.[0]?.url
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      {/* 번호 */}
                      <td className="px-4 py-3 text-xs text-slate-400">#{product.id}</td>

                      {/* 상품명 + 썸네일 */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                            {thumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={thumbnail}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={16} className="text-slate-300" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-slate-800 line-clamp-1">
                            {product.title}
                          </span>
                        </div>
                      </td>

                      {/* 판매가 */}
                      <td className="px-4 py-3 text-right font-medium text-slate-700">
                        {product.price === 0
                          ? <span className="text-emerald-600 text-xs font-bold">무료</span>
                          : `${product.price.toLocaleString()}원`
                        }
                      </td>

                      {/* 상태 (인라인 변경) */}
                      <td className="px-4 py-3 text-center">
                        <StatusSelect
                          productId={product.id}
                          value={product.status}
                          onChange={handleStatusChange}
                        />
                      </td>

                      {/* 재고 */}
                      <td className="px-4 py-3 text-center">
                        <span className={product.stock === 0 ? 'text-red-500 font-medium' : 'text-slate-600'}>
                          {product.stock}
                        </span>
                      </td>

                      {/* 카테고리 */}
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {(product.category as any)?.title ?? '-'}
                      </td>

                      {/* 등록일 */}
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {product.createdAt?.slice(0, 10)}
                      </td>

                      {/* 편집/삭제 */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="편집"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="삭제"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
            <span>총 {totalDocs}개</span>
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

      {/* ProductDrawer */}
      <ProductDrawer
        open={drawerOpen}
        product={editProduct}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
      />

      {/* 삭제 확인 */}
      {deleteTarget && (
        <DeleteDialog
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
