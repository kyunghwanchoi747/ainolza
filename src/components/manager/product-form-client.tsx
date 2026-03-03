'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormClientProps {
  mode: 'create' | 'edit'
  initialData?: {
    id?: string
    title?: string
    slug?: string
    description?: string
    price?: number
    category?: string
    content?: string
    status?: string
    featured?: boolean
  }
  categories: Category[]
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ProductFormClient({
  mode,
  initialData,
  categories,
}: ProductFormClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [price, setPrice] = useState(initialData?.price ?? 0)
  const [category, setCategory] = useState(initialData?.category || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [status, setStatus] = useState(initialData?.status || 'draft')
  const [featured, setFeatured] = useState(initialData?.featured || false)

  const handleTitleBlur = () => {
    if (!slug && title) {
      setSlug(generateSlug(title))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('상품 제목을 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    const body = {
      ...(mode === 'edit' && initialData?.id ? { id: initialData.id } : {}),
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      description: description.trim(),
      price: Number(price),
      category,
      content: content.trim(),
      status,
      featured,
    }

    try {
      const res = await fetch('/api/manager/products', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: '저장에 실패했습니다.' }))
        throw new Error((data as { error?: string }).error || '저장에 실패했습니다.')
      }

      toast.success(
        mode === 'create' ? '상품이 등록되었습니다.' : '상품이 수정되었습니다.'
      )
      router.push('/manager/products')
    } catch (err: any) {
      toast.error(err.message || '저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === 'create' ? '새 상품 등록' : '상품 수정'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목 <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="상품 제목을 입력하세요"
              required
            />
          </div>

          {/* 슬러그 */}
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              슬러그
            </label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '')
                )
              }
              placeholder="자동 생성됩니다 (영문, 숫자, 하이픈만 허용)"
            />
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상품에 대한 간단한 설명"
              className="w-full rounded-md border p-3 min-h-[100px] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* 가격 */}
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              가격 (원)
            </label>
            <Input
              id="price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              카테고리
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border p-2.5 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 콘텐츠 */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              상세 내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상품의 상세 내용을 입력하세요"
              className="w-full rounded-md border p-3 min-h-[200px] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* 상태 */}
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              상태
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border p-2.5 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="draft">임시저장</option>
              <option value="published">발행됨</option>
            </select>
          </div>

          {/* 추천 상품 */}
          <div className="flex items-center gap-2">
            <input
              id="featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              추천 상품으로 표시
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting
                ? '저장 중...'
                : mode === 'create'
                  ? '등록하기'
                  : '수정하기'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/manager/products')}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
