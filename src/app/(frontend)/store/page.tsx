import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function StorePage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  })

  const products = result.docs
  const categories = await payload.find({ collection: 'product-categories', sort: 'order', limit: 100 })
  const categoryList = categories.docs

  return (
    <div className="container max-w-screen-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">스토어</h1>
        <p className="text-muted-foreground mt-2">강의, 책, 템플릿 등 다양한 콘텐츠를 만나보세요.</p>
      </div>

      {/* Category filter */}
      {categoryList.length > 0 && (
        <div className="flex gap-2 mb-8 flex-wrap">
          <Badge variant="default" className="cursor-pointer">전체</Badge>
          {categoryList.map((cat: any) => (
            <Badge key={cat.id} variant="outline" className="cursor-pointer">{cat.name}</Badge>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">&#128230;</div>
          <p className="text-lg font-medium mb-2">스토어 준비 중입니다</p>
          <p className="text-sm text-muted-foreground mb-6">AI 템플릿, 강의, 전자책 등 다양한 콘텐츠가 곧 등록될 예정이에요.</p>
          <Link href="/programs" className="text-sm text-primary hover:underline">프로그램 둘러보기 &rarr;</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: any) => (
            <Link
              key={product.id}
              href={`/store/${product.slug}`}
              className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.thumbnail?.url ? (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={product.thumbnail.url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">이미지 없음</span>
                </div>
              )}
              <div className="p-4">
                {product.category && (
                  <Badge variant="secondary" className="mb-2 text-xs">{product.category}</Badge>
                )}
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                  {product.title}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                )}
                <p className="text-lg font-bold mt-3">
                  {product.price === 0 ? '무료' : `₩${product.price.toLocaleString()}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
