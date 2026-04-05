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

export const dynamic = 'force-dynamic'

export default async function ManagerDashboard() {
  let pageCount = 0
  let publishedPageCount = 0
  let productCount = 0
  let postCount = 0
  let programCount = 0
  let recentPages: any[] = []

  const orderStats: { date: string; orders: number; revenue: number }[] = []
  let totalRevenue = 0

  try {
    const payload = await getPayloadClient()

    const [pagesResult, productsResult, postsResult, programsResult, ordersResult, enrollResult] = await Promise.all([
      payload.find({ collection: 'design-pages', sort: '-updatedAt', limit: 5 }),
      payload.find({ collection: 'products', limit: 0 }),
      payload.find({ collection: 'posts', limit: 0 }),
      payload.find({ collection: 'programs', limit: 0 }),
      payload.find({ collection: 'orders', sort: '-createdAt', limit: 200 }),
      payload.find({ collection: 'enrollments', limit: 0 }),
    ])

    // enrollmentCount available via enrollResult.totalDocs
    const allOrders = ordersResult.docs as any[]

    // 최근 7일 기간별 통계
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayOrders = allOrders.filter((o: any) => o.createdAt?.startsWith(dateStr))
      const dayPaid = dayOrders.filter((o: any) => ['paid', 'active', 'completed'].includes(o.status))
      const dayRevenue = dayPaid.reduce((sum: number, o: any) => sum + (o.amount || 0), 0)
      orderStats.push({ date: dateStr, orders: dayPaid.length, revenue: dayRevenue })
    }

    totalRevenue = allOrders.filter((o: any) => ['paid', 'active', 'completed'].includes(o.status)).reduce((sum: number, o: any) => sum + (o.amount || 0), 0)
    // todayOrders available via orderStats[0]

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

      {/* 기간별 매출 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>기간별 분석</CardTitle>
          <CardDescription>최근 7일간 주문 및 매출 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">날짜</th>
                  <th className="text-right p-3 font-medium">주문수</th>
                  <th className="text-right p-3 font-medium">매출액</th>
                </tr>
              </thead>
              <tbody>
                {orderStats.map((s, i) => (
                  <tr key={i} className={`border-b ${i === 0 ? 'bg-primary/5 font-medium' : ''}`}>
                    <td className="p-3">{s.date}</td>
                    <td className="p-3 text-right">{s.orders}</td>
                    <td className="p-3 text-right font-medium">{s.revenue.toLocaleString()}원</td>
                  </tr>
                ))}
                <tr className="border-t-2 font-bold">
                  <td className="p-3">최근 7일 합계</td>
                  <td className="p-3 text-right">{orderStats.reduce((s, o) => s + o.orders, 0)}건</td>
                  <td className="p-3 text-right text-green-600">{orderStats.reduce((s, o) => s + o.revenue, 0).toLocaleString()}원</td>
                </tr>
                <tr className="font-bold">
                  <td className="p-3">전체 누적</td>
                  <td className="p-3 text-right"></td>
                  <td className="p-3 text-right text-green-600">{totalRevenue.toLocaleString()}원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
