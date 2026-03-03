import { getPayloadClient } from '@/lib/payload'
import { ProductsListClient } from '@/components/manager/products-list-client'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  let products: {
    id: string
    title: string
    slug: string
    price: number
    category: string
    status: string
    featured: boolean
    updatedAt: string
  }[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      sort: '-updatedAt',
      limit: 100,
    })
    products = result.docs.map((doc: any) => ({
      id: String(doc.id),
      title: doc.title || '',
      slug: doc.slug || '',
      price: doc.price || 0,
      category: doc.category || '',
      status: doc.status || 'draft',
      featured: doc.featured || false,
      updatedAt: doc.updatedAt || '',
    }))
  } catch {
    // DB 연결 실패 시 빈 목록으로 렌더링
  }

  return <ProductsListClient initialProducts={products} />
}
