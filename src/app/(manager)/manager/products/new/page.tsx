import { getPayloadClient } from '@/lib/payload'
import { ProductFormClient } from '@/components/manager/product-form-client'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  let categories: { id: string; name: string; slug: string }[] = []
  let ebooks: { id: string; title: string; filename?: string }[] = []

  try {
    const payload = await getPayloadClient()
    const [catResult, ebookResult] = await Promise.all([
      payload.find({ collection: 'product-categories', sort: 'name', limit: 100 }),
      payload.find({
        collection: 'ebooks' as any,
        sort: '-updatedAt',
        limit: 100,
        depth: 0,
        overrideAccess: true,
      }),
    ])
    categories = catResult.docs.map((doc: any) => ({
      id: String(doc.id),
      name: doc.name || '',
      slug: doc.slug || '',
    }))
    ebooks = (ebookResult.docs as any[]).map((doc) => ({
      id: String(doc.id),
      title: doc.title || '(제목 없음)',
      filename: doc.filename,
    }))
  } catch {
    // 로드 실패 시 빈 배열로 진행
  }

  return <ProductFormClient mode="create" categories={categories} ebooks={ebooks} />
}
