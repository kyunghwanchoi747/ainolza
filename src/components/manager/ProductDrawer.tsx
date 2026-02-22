'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Upload, ImageIcon, Loader2, AlertCircle } from 'lucide-react'
import { lexicalToText } from '@/lib/lexical'

interface Category {
  id: number
  title: string
  slug: string
}

interface MediaDoc {
  id: number
  url: string
  filename: string
}

export interface ProductDoc {
  id: number
  title: string
  price: number
  stock: number
  status: string
  category?: { id: number; title: string } | null
  images?: MediaDoc[]
  description?: unknown
  createdAt: string
  updatedAt: string
}

interface ProductDrawerProps {
  open: boolean
  product: ProductDoc | null  // null = 신규 등록
  onClose: () => void
  onSaved: (product: ProductDoc) => void
}

const STATUS_OPTIONS = [
  { value: 'published', label: '판매중' },
  { value: 'sold_out', label: '품절' },
  { value: 'hidden', label: '숨김' },
]

export function ProductDrawer({ open, product, onClose, onSaved }: ProductDrawerProps) {
  const isEdit = product !== null

  // ── Form State ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('0')
  const [stock, setStock] = useState('0')
  const [status, setStatus] = useState('published')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newImageId, setNewImageId] = useState<number | null>(null)

  // ── UI State ──────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Effects ───────────────────────────────────────────────────────────────

  // 카테고리 fetch
  useEffect(() => {
    fetch('/api/categories?where[type][equals]=shop&limit=50')
      .then((r) => r.json())
      .then((data: any) => setCategories(data.docs ?? []))
      .catch(() => {})
  }, [])

  // 상품 데이터가 바뀌면 폼 초기화
  useEffect(() => {
    if (!open) return
    if (product) {
      setTitle(product.title)
      setPrice(String(product.price))
      setStock(String(product.stock))
      setStatus(product.status)
      setCategoryId(product.category ? String(product.category.id) : '')
      setDescription(lexicalToText(product.description))
      setImagePreview(product.images?.[0]?.url ?? null)
      setNewImageId(null)
    } else {
      setTitle('')
      setPrice('0')
      setStock('0')
      setStatus('published')
      setCategoryId('')
      setDescription('')
      setImagePreview(null)
      setNewImageId(null)
    }
    setError('')
  }, [open, product])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 미리보기
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // 업로드
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', title || file.name)

      const res = await fetch('/api/media', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json() as any
      const mediaDoc = data.doc ?? data
      setNewImageId(mediaDoc.id)
      setImagePreview(mediaDoc.url)
    } catch {
      setError('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError('상품명을 입력해주세요.')
      return
    }
    setSaving(true)
    setError('')

    const body: any = {
      title: title.trim(),
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      status,
      description: description.trim(),
    }
    if (categoryId) body.category = categoryId
    if (newImageId !== null) body.imageId = newImageId

    const url = isEdit ? `/api/manager/products/${product!.id}` : '/api/manager/products'
    const method = isEdit ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json() as any
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      onSaved(data as ProductDoc)
      onClose()
    } catch (err: any) {
      setError(err.message ?? '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? '상품 수정' : '새 상품 등록'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* 대표 이미지 */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">대표 이미지</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors overflow-hidden"
            >
              {uploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 size={24} className="text-blue-600 animate-spin" />
                </div>
              )}
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ImageIcon size={32} />
                  <span className="text-xs">클릭하여 이미지 추가</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImagePreview(null); setNewImageId(-1) }}
                className="mt-1.5 text-xs text-red-500 hover:underline"
              >
                이미지 제거
              </button>
            )}
          </div>

          {/* 상품명 */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              상품명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="상품명을 입력하세요"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 판매가 / 재고 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">판매가 (원)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">재고 수량</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 카테고리 / 상태 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">카테고리</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">카테고리 없음</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">판매 상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 상세 설명 */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">상세 설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상품에 대한 설명을 입력하세요"
              rows={6}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* 에러 */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? '저장' : '상품 등록'}
          </button>
        </div>
      </div>
    </>
  )
}
