'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PostFormData {
  title: string
  content: string
  author: string
  category: string
  status: string
  pinned: boolean
}

interface PostFormClientProps {
  mode: 'create' | 'edit'
  initialData?: any
}

export function PostFormClient({ mode, initialData }: PostFormClientProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<PostFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    author: initialData?.author || '관리자',
    category: initialData?.category || 'free',
    status: initialData?.status || 'draft',
    pinned: initialData?.pinned || false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title.trim()) {
      toast.error('제목을 입력해주세요')
      return
    }
    if (!form.content.trim()) {
      toast.error('내용을 입력해주세요')
      return
    }

    setSubmitting(true)
    try {
      const body =
        mode === 'edit'
          ? { ...form, id: initialData?.id }
          : form

      const res = await fetch('/api/manager/posts', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()

      toast.success(mode === 'edit' ? '게시글이 수정되었습니다' : '게시글이 작성되었습니다')
      router.push('/manager/posts')
    } catch {
      toast.error('저장 중 오류가 발생했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/manager/posts')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === 'edit' ? '게시글 수정' : '새 게시글'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{mode === 'edit' ? '게시글 수정' : '게시글 작성'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                제목 <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="게시글 제목을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                내용 <span className="text-destructive">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="게시글 내용을 입력하세요"
                required
                className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="author" className="text-sm font-medium">
                  작성자
                </label>
                <Input
                  id="author"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="작성자"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  카테고리
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="free">자유</option>
                  <option value="question">질문</option>
                  <option value="share">공유</option>
                  <option value="notice">공지</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  상태
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="draft">임시저장</option>
                  <option value="published">게시</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinned"
                name="pinned"
                checked={form.pinned}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="pinned" className="text-sm font-medium">
                상단 고정
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? '저장 중...'
                  : mode === 'edit'
                    ? '수정하기'
                    : '작성하기'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/manager/posts')}
                disabled={submitting}
              >
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
