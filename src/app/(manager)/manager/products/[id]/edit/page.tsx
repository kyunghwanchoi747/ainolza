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
  let ebooks: { id: string; title: string; filename?: string }[] = []

  try {
    const payload = await getPayloadClient()

    // 상품·카테고리·전자책 목록 병렬 조회
    const [productResult, categoriesResult, ebooksResult] = await Promise.all([
      payload.findByID({ collection: 'products', id, depth: 1 }),
      payload.find({ collection: 'product-categories', sort: 'name', limit: 100 }),
      payload.find({
        collection: 'ebooks' as any,
        sort: '-updatedAt',
        limit: 100,
        depth: 0,
        overrideAccess: true,
      }),
    ])

    product = productResult
    categories = categoriesResult.docs.map((doc: any) => ({
      id: String(doc.id),
      name: doc.name || '',
      slug: doc.slug || '',
    }))
    ebooks = (ebooksResult.docs as any[]).map((doc) => ({
      id: String(doc.id),
      title: doc.title || '(제목 없음)',
      filename: doc.filename,
    }))
  } catch {
    notFound()
  }

  if (!product) {
    notFound()
  }

  const ebookFileId =
    typeof product.ebookFile === 'object' && product.ebookFile
      ? String(product.ebookFile.id)
      : product.ebookFile
        ? String(product.ebookFile)
        : ''

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
    productType: product.productType || 'class',
    ebookFile: ebookFileId,
  }

  return (
    <ProductFormClient
      mode="edit"
      initialData={initialData}
      categories={categories}
      ebooks={ebooks}
    />
  )
}
