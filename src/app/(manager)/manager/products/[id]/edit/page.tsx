import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { ProductFormClient } from '@/components/manager/product-form-client'

export const dynamic = 'force-dynamic'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  let product: any = null
  let categories: { id: string; name: string; slug: string }[] = []

  try {
    const payload = await getPayloadClient()

    // 상품과 카테고리를 병렬로 가져옴
    const [productResult, categoriesResult] = await Promise.all([
      payload.findByID({ collection: 'products', id }),
      payload.find({ collection: 'product-categories', sort: 'name', limit: 100 }),
    ])

    product = productResult
    categories = categoriesResult.docs.map((doc: any) => ({
      id: String(doc.id),
      name: doc.name || '',
      slug: doc.slug || '',
    }))
  } catch {
    notFound()
  }

  if (!product) {
    notFound()
  }

  const initialData = {
    id: String(product.id),
    title: product.title || '',
    slug: product.slug || '',
    description: product.description || '',
    price: product.price || 0,
    category: product.category || '',
    content: product.content || '',
    status: product.status || 'draft',
    featured: product.featured || false,
  }

  return (
    <ProductFormClient
      mode="edit"
      initialData={initialData}
      categories={categories}
    />
  )
}
