'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { toast } from 'sonner'
import { Plus, Search, MoreHorizontal, Pencil, Eye, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Program {
  id: string
  title: string
  slug: string
  version: string
  platform: string
  category: string
  status: string
  featured: boolean
  updatedAt: string
}

const platformLabels: Record<string, string> = {
  windows: 'Windows',
  mac: 'Mac',
  linux: 'Linux',
  web: 'Web',
  all: '전체',
}

const categoryLabels: Record<string, string> = {
  utility: '유틸리티',
  'ai-tool': 'AI 도구',
  plugin: '플러그인',
  other: '기타',
}

export function ProgramsListClient({ initialPrograms }: { initialPrograms: Program[] }) {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>(initialPrograms)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/manager/programs?id=${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('삭제 실패')
      setPrograms((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success('프로그램이 삭제되었습니다.')
    } catch {
      toast.error('프로그램 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">프로그램 관리</CardTitle>
            <Button onClick={() => router.push('/manager/programs/new')}>
              <Plus className="mr-2 h-4 w-4" />
              새 프로그램
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="제목 또는 슬러그로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {search ? '검색 결과가 없습니다.' : '등록된 프로그램이 없습니다.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-medium">제목</th>
                    <th className="pb-3 pr-4 font-medium">버전</th>
                    <th className="pb-3 pr-4 font-medium">플랫폼</th>
                    <th className="pb-3 pr-4 font-medium">카테고리</th>
                    <th className="pb-3 pr-4 font-medium">상태</th>
                    <th className="pb-3 pr-4 font-medium">수정일</th>
                    <th className="pb-3 font-medium">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((program) => (
                    <tr key={program.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{program.title}</span>
                          {program.featured && (
                            <Badge variant="secondary" className="text-xs">
                              추천
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{program.version || '-'}</td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline">
                          {platformLabels[program.platform] || program.platform}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {categoryLabels[program.category] || program.category || '-'}
                      </td>
                      <td className="py-3 pr-4">
                        {program.status === 'published' ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">공개</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">임시저장</Badge>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {program.updatedAt
                          ? format(new Date(program.updatedAt), 'yyyy.MM.dd', { locale: ko })
                          : '-'}
                      </td>
                      <td className="py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/manager/programs/${program.id}/edit`)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              편집
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`/programs/${program.slug}`, '_blank')}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              미리보기
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => setDeleteTarget(program)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로그램 삭제</DialogTitle>
            <DialogDescription>
              &quot;{deleteTarget?.title}&quot; 프로그램을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
