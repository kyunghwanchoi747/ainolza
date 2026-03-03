'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
  Package,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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

interface Product {
  id: string
  title: string
  slug: string
  price: number
  category: string
  status: string
  featured: boolean
  updatedAt: string
}

interface ProductsListClientProps {
  initialProducts: Product[]
}

export function ProductsListClient({ initialProducts }: ProductsListClientProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/manager/products?id=${deleteTarget.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('삭제 실패')
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success('상품이 삭제되었습니다.')
    } catch (err) {
      toast.error('상품 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">발행됨</Badge>
      case 'draft':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">임시저장</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="h-6 w-6" />
                상품 관리
              </CardTitle>
              <CardDescription>
                등록된 상품을 관리합니다. 총 {products.length}개의 상품이 있습니다.
              </CardDescription>
            </div>
            <Link href="/manager/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                새 상품 등록
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목 또는 슬러그로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {search ? '검색 결과가 없습니다.' : '등록된 상품이 없습니다.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">제목</th>
                    <th className="text-left p-3 font-medium">슬러그</th>
                    <th className="text-right p-3 font-medium">가격</th>
                    <th className="text-left p-3 font-medium">카테고리</th>
                    <th className="text-center p-3 font-medium">상태</th>
                    <th className="text-left p-3 font-medium">수정일</th>
                    <th className="text-center p-3 font-medium">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.title}</span>
                          {product.featured && (
                            <Badge variant="outline" className="text-xs">추천</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{product.slug}</td>
                      <td className="p-3 text-right">
                        &#8361;{product.price.toLocaleString()}
                      </td>
                      <td className="p-3">{product.category || '-'}</td>
                      <td className="p-3 text-center">{getStatusBadge(product.status)}</td>
                      <td className="p-3 text-muted-foreground">
                        {product.updatedAt
                          ? format(new Date(product.updatedAt), 'yyyy.MM.dd HH:mm', {
                              locale: ko,
                            })
                          : '-'}
                      </td>
                      <td className="p-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/manager/products/${product.id}/edit`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              편집
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(`/store/${product.slug}`, '_blank')
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              미리보기
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(product)}
                              className="text-destructive focus:text-destructive"
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

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>상품 삭제</DialogTitle>
            <DialogDescription>
              &quot;{deleteTarget?.title}&quot; 상품을 정말 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
