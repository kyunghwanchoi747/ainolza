import { getPayloadClient } from '@/lib/payload'
import { ProductFormClient } from '@/components/manager/product-form-client'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  let categories: { id: string; name: string; slug: string }[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'product-categories',
      sort: 'name',
      limit: 100,
    })
    categories = result.docs.map((doc: any) => ({
      id: String(doc.id),
      name: doc.name || '',
      slug: doc.slug || '',
    }))
  } catch {
    // 카테고리 로드 실패 시 빈 배열로 진행
  }

  return <ProductFormClient mode="create" categories={categories} />
}
