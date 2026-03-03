'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  ExternalLink,
  Pin,
  PinOff,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface Post {
  id: string
  title: string
  author: string
  category: string
  status: string
  views: number
  pinned: boolean
  updatedAt: string
}

const categoryMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
  notice: { label: '공지', variant: 'default' },
  question: { label: '질문', variant: 'outline' },
  free: { label: '자유', variant: 'secondary' },
  share: { label: '공유', variant: 'secondary' },
}

const statusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
  published: { label: '게시', variant: 'default' },
  draft: { label: '임시저장', variant: 'secondary' },
}

export function PostsListClient({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase())
  )

  const handleTogglePin = async (post: Post) => {
    try {
      const res = await fetch(`/api/manager/posts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, pinned: !post.pinned }),
      })
      if (!res.ok) throw new Error()
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, pinned: !p.pinned } : p))
      )
      toast.success(post.pinned ? '고정 해제되었습니다' : '상단에 고정되었습니다')
    } catch {
      toast.error('처리 중 오류가 발생했습니다')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/manager/posts?id=${deleteTarget.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error()
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success('게시글이 삭제되었습니다')
    } catch {
      toast.error('삭제 중 오류가 발생했습니다')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">게시판 관리</h1>
        <Button onClick={() => router.push('/manager/posts/new')}>
          <Plus className="mr-2 h-4 w-4" />
          새 게시글
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="제목 또는 작성자 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">제목</th>
              <th className="px-4 py-3 text-left font-medium">작성자</th>
              <th className="px-4 py-3 text-left font-medium">카테고리</th>
              <th className="px-4 py-3 text-left font-medium">상태</th>
              <th className="px-4 py-3 text-right font-medium">조회수</th>
              <th className="px-4 py-3 text-left font-medium">수정일</th>
              <th className="px-4 py-3 text-right font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  게시글이 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((post) => {
                const cat = categoryMap[post.category] || { label: post.category, variant: 'secondary' as const }
                const stat = statusMap[post.status] || { label: post.status, variant: 'secondary' as const }
                return (
                  <tr key={post.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {post.pinned && <span title="고정됨">📌</span>}
                        <span className="font-medium">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{post.author}</td>
                    <td className="px-4 py-3">
                      <Badge variant={cat.variant}>{cat.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={stat.variant}>{stat.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{post.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {post.updatedAt
                        ? format(new Date(post.updatedAt), 'yyyy.MM.dd', { locale: ko })
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/manager/posts/${post.id}/edit`)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            편집
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(`/community/${post.id}`, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            미리보기
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePin(post)}>
                            {post.pinned ? (
                              <>
                                <PinOff className="mr-2 h-4 w-4" />
                                고정해제
                              </>
                            ) : (
                              <>
                                <Pin className="mr-2 h-4 w-4" />
                                고정
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(post)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>
              &quot;{deleteTarget?.title}&quot; 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
