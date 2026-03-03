import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })

  const product = result.docs[0] as any
  if (!product) return notFound()

  return (
    <div className="container max-w-screen-lg px-4 py-8">
      <Link href="/store" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        &larr; 스토어로 돌아가기
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Thumbnail */}
        <div className="rounded-xl overflow-hidden bg-muted">
          {product.thumbnail?.url ? (
            <img src={product.thumbnail.url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="aspect-video flex items-center justify-center">
              <span className="text-muted-foreground">이미지 없음</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Badge variant="secondary" className="mb-3">{product.category}</Badge>
          )}
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          {product.description && (
            <p className="text-muted-foreground mb-6">{product.description}</p>
          )}
          <p className="text-3xl font-bold mb-6">
            {product.price === 0 ? '무료' : `₩${product.price.toLocaleString()}`}
          </p>
          <Button size="lg" className="w-full">구매하기</Button>
        </div>
      </div>

      {/* Content */}
      {product.content && (
        <div className="mt-12 prose prose-neutral dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">상세 설명</h2>
          <div className="whitespace-pre-wrap text-muted-foreground">{product.content}</div>
        </div>
      )}
    </div>
  )
}
