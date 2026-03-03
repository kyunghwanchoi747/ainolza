'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProgramFormProps {
  mode: 'create' | 'edit'
  initialData?: any
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function ProgramFormClient({ mode, initialData }: ProgramFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [version, setVersion] = useState(initialData?.version || '')
  const [downloadUrl, setDownloadUrl] = useState(initialData?.downloadUrl || '')
  const [platform, setPlatform] = useState(initialData?.platform || 'all')
  const [category, setCategory] = useState(initialData?.category || 'utility')
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
      toast.error('제목을 입력해주세요.')
      return
    }

    setSaving(true)

    const body = {
      title,
      slug,
      description,
      version,
      downloadUrl,
      platform,
      category,
      status,
      featured,
      ...(mode === 'edit' && initialData?.id ? { id: initialData.id } : {}),
    }

    try {
      const res = await fetch('/api/manager/programs', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: '저장에 실패했습니다.' }))
        throw new Error((data as { error?: string }).error || '저장에 실패했습니다.')
      }

      toast.success(mode === 'create' ? '프로그램이 생성되었습니다.' : '프로그램이 수정되었습니다.')
      router.push('/manager/programs')
    } catch (err: any) {
      toast.error(err.message || '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/manager/programs')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold">
            {mode === 'create' ? '새 프로그램' : '프로그램 수정'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목 <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="프로그램 제목"
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
              onChange={(e) => setSlug(e.target.value)}
              placeholder="프로그램 슬러그 (자동 생성)"
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
              placeholder="프로그램에 대한 설명을 입력하세요..."
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* 버전 */}
          <div className="space-y-2">
            <label htmlFor="version" className="text-sm font-medium">
              버전
            </label>
            <Input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="v1.0.0"
            />
          </div>

          {/* 다운로드 URL */}
          <div className="space-y-2">
            <label htmlFor="downloadUrl" className="text-sm font-medium">
              다운로드 URL
            </label>
            <Input
              id="downloadUrl"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* 플랫폼 */}
          <div className="space-y-2">
            <label htmlFor="platform" className="text-sm font-medium">
              플랫폼
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="windows">Windows</option>
              <option value="mac">Mac</option>
              <option value="linux">Linux</option>
              <option value="web">Web</option>
              <option value="all">전체</option>
            </select>
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
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="utility">유틸리티</option>
              <option value="ai-tool">AI 도구</option>
              <option value="plugin">플러그인</option>
              <option value="other">기타</option>
            </select>
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
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="draft">임시저장</option>
              <option value="published">공개</option>
            </select>
          </div>

          {/* 추천 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              추천 프로그램으로 표시
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? '저장 중...' : mode === 'create' ? '생성' : '수정'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/manager/programs')}
              disabled={saving}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
