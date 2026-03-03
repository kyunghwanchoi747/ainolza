'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  Plus,
  Pencil,
  Eye,
  Trash2,
  MoreHorizontal,
  FileText,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DesignPage {
  id: string
  title: string
  slug: string
  status: string
  updatedAt: string
  createdAt: string
}

interface DesignListClientProps {
  initialPages: DesignPage[]
}

export function DesignListClient({ initialPages }: DesignListClientProps) {
  const router = useRouter()
  const [pages, setPages] = useState<DesignPage[]>(initialPages)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<DesignPage | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/manager/pages?id=${deleteTarget.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('페이지가 삭제되었습니다.')
        setPages(prev => prev.filter(p => p.id !== deleteTarget.id))
      } else {
        const err: any = await res.json().catch(() => ({}))
        toast.error(`삭제 실패: ${err.error || '알 수 없는 오류'}`)
      }
    } catch {
      toast.error('삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'yyyy.MM.dd HH:mm', { locale: ko })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">페이지 관리</h1>
          <p className="text-muted-foreground mt-1">페이지를 생성하고 관리하세요.</p>
        </div>
        <Button asChild>
          <Link href="/manager/design/editor/new">
            <Plus className="mr-2 h-4 w-4" />
            새 페이지
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="페이지 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          총 {filteredPages.length}개
        </p>
      </div>

      {/* Table */}
      {filteredPages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/20">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-1">
            {searchQuery ? '검색 결과가 없습니다' : '아직 만든 페이지가 없습니다'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? '다른 키워드로 검색해 보세요.' : '첫 페이지를 만들어 보세요.'}
          </p>
          {!searchQuery && (
            <Button asChild>
              <Link href="/manager/design/editor/new">
                <Plus className="mr-2 h-4 w-4" />
                새 페이지 만들기
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">제목</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">슬러그</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">상태</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">수정일</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map(page => (
                <tr
                  key={page.id}
                  className="border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/manager/design/editor/${page.id}`)}
                >
                  <td className="p-3">
                    <span className="font-medium text-sm">{page.title}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-muted-foreground">/{page.slug}</span>
                  </td>
                  <td className="p-3">
                    <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
                      {page.status === 'published' ? '게시됨' : '임시저장'}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(page.updatedAt)}
                    </span>
                  </td>
                  <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/manager/design/editor/${page.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          편집
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const url = page.slug === 'home' ? '/' : `/p/${page.slug}`
                            window.open(url, '_blank')
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          미리보기
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(page)}
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

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>페이지 삭제</DialogTitle>
            <DialogDescription>
              <strong>{deleteTarget?.title}</strong> 페이지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
    </div>
  )
}
