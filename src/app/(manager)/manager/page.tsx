import Link from 'next/link'
import {
  FileText,
  Plus,
  Eye,
  Pencil,
  ArrowRight,
  Globe,
  FileEdit,
  ShoppingBag,
  MessageSquare,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPayloadClient } from '@/lib/payload'

export default async function ManagerDashboard() {
  let pageCount = 0
  let publishedPageCount = 0
  let productCount = 0
  let postCount = 0
  let programCount = 0
  let recentPages: any[] = []

  try {
    const payload = await getPayloadClient()

    const [pagesResult, productsResult, postsResult, programsResult] = await Promise.all([
      payload.find({ collection: 'design-pages', sort: '-updatedAt', limit: 5 }),
      payload.find({ collection: 'products', limit: 0 }),
      payload.find({ collection: 'posts', limit: 0 }),
      payload.find({ collection: 'programs', limit: 0 }),
    ])

    pageCount = pagesResult.totalDocs
    publishedPageCount = (await payload.find({
      collection: 'design-pages',
      where: { status: { equals: 'published' } },
      limit: 0,
    })).totalDocs
    productCount = productsResult.totalDocs
    postCount = postsResult.totalDocs
    programCount = programsResult.totalDocs

    recentPages = pagesResult.docs.map((doc: any) => ({
      id: String(doc.id),
      title: doc.title || '',
      slug: doc.slug || '',
      status: doc.status || 'draft',
    }))
  } catch {
    // DB not ready
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground mt-1">AI 놀자 홈페이지를 관리하세요.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">페이지</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">게시됨</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedPageCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">상품</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">게시글</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">프로그램</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">임시저장</CardTitle>
            <FileEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pageCount - publishedPageCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + Recent pages */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>빠른 시작</CardTitle>
            <CardDescription>자주 사용하는 기능에 빠르게 접근하세요.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild className="justify-start">
              <Link href="/manager/design/editor/new">
                <Plus className="mr-2 h-4 w-4" />
                새 페이지 만들기
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/manager/products/new">
                <ShoppingBag className="mr-2 h-4 w-4" />
                새 상품 등록
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/manager/posts/new">
                <MessageSquare className="mr-2 h-4 w-4" />
                새 게시글 작성
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/manager/programs/new">
                <Download className="mr-2 h-4 w-4" />
                새 프로그램 등록
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                사이트 미리보기
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>최근 페이지</CardTitle>
              <CardDescription>최근 수정된 페이지입니다.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/manager/design">
                전체보기
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPages.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">아직 만든 페이지가 없습니다.</p>
                <Button size="sm" asChild>
                  <Link href="/manager/design/editor/new">
                    <Plus className="mr-1 h-3 w-3" />
                    첫 페이지 만들기
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPages.map(page => (
                  <div key={page.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{page.title}</p>
                      <p className="text-xs text-muted-foreground">/{page.slug}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
                        {page.status === 'published' ? '게시됨' : '임시저장'}
                      </Badge>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/manager/design/editor/${page.id}`}>
                          <Pencil className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
