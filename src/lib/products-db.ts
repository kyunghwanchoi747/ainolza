/**
 * DB(Payload Products 컬렉션)에서 상품을 읽어 lib/products.ts 의 Product 형태로 변환.
 * DB가 비어있거나 에러면 lib/products.ts 의 PRODUCTS 폴백.
 */
import type { Product, ProductAction } from './products'
import { PRODUCTS, getProduct as getFileProduct } from './products'
import { getPayloadClient } from './payload'

type DbProduct = {
  id: number | string
  title: string
  slug: string
  subtitle?: string | null
  shortDescription?: string | null
  productType?: 'class' | 'book' | 'ebook' | 'bundle' | null
  category?: string | null
  price?: number | null
  originalPrice?: number | null
  priceLabel?: string | null
  discountUntil?: string | null
  classroomSlug?: string | null
  thumbnail?: { id: number; url?: string; filename?: string } | number | null
  detailImages?: Array<{
    id?: string
    image?: { id: number; url?: string; filename?: string } | number | null
  }> | null
  actions?: Array<{
    id?: string
    label: string
    url: string
    primary?: boolean | null
    external?: boolean | null
  }> | null
  order?: number | null
  status?: 'published' | 'draft' | null
  featured?: boolean | null
  seoType?: 'Product' | 'Course' | 'Book' | null
  seoAuthor?: string | null
}

function dbToProduct(d: DbProduct): Product {
  const actions: ProductAction[] = (d.actions || []).map((a) => ({
    label: a.label,
    url: a.url,
    primary: !!a.primary,
    external: !!a.external,
  }))

  // 이미지 URL 추출
  const thumbnailUrl =
    typeof d.thumbnail === 'object' && d.thumbnail !== null
      ? d.thumbnail.url || ''
      : ''
  const detailUrls: string[] =
    (d.detailImages || [])
      .map((di) => {
        if (di.image && typeof di.image === 'object') {
          return di.image.url || ''
        }
        return ''
      })
      .filter(Boolean)

  return {
    slug: d.slug,
    type: (d.productType || 'class') as Product['type'],
    category: d.category || '',
    title: d.title,
    subtitle: d.subtitle || undefined,
    shortDescription: d.shortDescription || undefined,
    price: d.price ?? undefined,
    originalPrice: d.originalPrice ?? undefined,
    priceLabel: d.priceLabel || undefined,
    discountUntil: d.discountUntil || undefined,
    actions,
    classroomSlug: (d.classroomSlug || undefined) as Product['classroomSlug'],
    detailImageCount: detailUrls.length || undefined,
    order: d.order ?? undefined,
    seo: d.seoType
      ? {
          type: d.seoType,
          ...(d.seoAuthor ? { author: d.seoAuthor } : {}),
        }
      : undefined,
    // 추가: DB에서 온 이미지 URL을 별도 필드로 보관 (렌더링 시 사용)
    ...(thumbnailUrl ? { _dbThumbnailUrl: thumbnailUrl } : {}),
    ...(detailUrls.length ? { _dbDetailUrls: detailUrls } : {}),
  } as Product & { _dbThumbnailUrl?: string; _dbDetailUrls?: string[] }
}

export type ProductWithDbImages = Product & {
  _dbThumbnailUrl?: string
  _dbDetailUrls?: string[]
}

/**
 * 모든 published 상품 (DB 우선, 폴백 파일)
 */
export async function listProductsForStore(): Promise<ProductWithDbImages[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      limit: 100,
      depth: 2,
      sort: 'order',
    })
    if (result.docs.length > 0) {
      return (result.docs as unknown as DbProduct[]).map(dbToProduct)
    }
  } catch {
    // DB 에러 → 파일 폴백
  }
  return PRODUCTS.filter((p) => !p.hidden)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

/**
 * 단일 상품 조회 (DB 우선, 폴백 파일)
 */
export async function getProductForStore(slug: string): Promise<ProductWithDbImages | undefined> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    if (result.docs.length > 0) {
      return dbToProduct(result.docs[0] as unknown as DbProduct)
    }
  } catch {
    // 파일 폴백
  }
  return getFileProduct(slug)
}
