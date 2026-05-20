/**
 * DB(Payload Products 컬렉션)에서 상품을 읽어 lib/products.ts 의 Product 형태로 변환.
 * DB가 비어있거나 에러면 lib/products.ts 의 PRODUCTS 폴백.
 */
import type { Product, ProductAction } from './products'
import { PRODUCTS, getProduct as getFileProduct } from './products'
import { getPayloadClient } from './payload'
import { resolveCurrentPrice, type PriceScheduleEntry } from './price-schedule'

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
  tags?: Array<{ id?: string; label: string }> | null
  duration?: string | null
  faq?: Array<{ id?: string; question: string; answer: string }> | null
  priceSchedule?: Array<{
    id?: string
    startAt: string
    price: number
    label?: string | null
  }> | null
  waitlistMode?: boolean | null
  waitlistNotice?: string | null
}

function dbToProduct(d: DbProduct): Product {
  // 스케줄 → 현재 가격으로 평탄화. 결제·노출 모두 동일한 값을 보도록 한 곳에서 결정.
  const schedule: PriceScheduleEntry[] = (d.priceSchedule || []).map((s) => ({
    startAt: s.startAt,
    price: s.price,
    label: s.label || undefined,
  }))
  const resolved = resolveCurrentPrice({
    price: d.price ?? null,
    originalPrice: d.originalPrice ?? null,
    priceSchedule: schedule,
  })
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
    // 스케줄 적용 후 현재 가격
    price: resolved.price,
    originalPrice: d.originalPrice ?? undefined,
    priceLabel: d.priceLabel || undefined,
    discountUntil: d.discountUntil || undefined,
    // 단계 라벨 + 다음 인상 정보 (UI 노출용)
    ...(resolved.label ? { _dbStageLabel: resolved.label } : {}),
    ...(resolved.nextChange
      ? {
          _dbNextChange: {
            startAt: resolved.nextChange.startAt,
            price: resolved.nextChange.price,
            label: resolved.nextChange.label,
          },
        }
      : {}),
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
    // 추가: DB에서 온 이미지 URL과 tags/duration을 별도 필드로 보관
    ...(thumbnailUrl ? { _dbThumbnailUrl: thumbnailUrl } : {}),
    ...(detailUrls.length ? { _dbDetailUrls: detailUrls } : {}),
    ...(d.tags && d.tags.length ? { _dbTags: d.tags.map((t) => t.label) } : {}),
    ...(d.duration ? { _dbDuration: d.duration } : {}),
    ...(d.faq && d.faq.length
      ? { _dbFaq: d.faq.map((f) => ({ question: f.question, answer: f.answer })) }
      : {}),
    ...(d.featured ? { _dbFeatured: true } : {}),
    ...(d.waitlistMode ? { _dbWaitlistMode: true } : {}),
    ...(d.waitlistNotice ? { _dbWaitlistNotice: d.waitlistNotice } : {}),
    _dbId: d.id,
  } as Product & {
    _dbThumbnailUrl?: string
    _dbDetailUrls?: string[]
    _dbTags?: string[]
    _dbDuration?: string
    _dbFaq?: Array<{ question: string; answer: string }>
    _dbFeatured?: boolean
    _dbStageLabel?: string
    _dbNextChange?: { startAt: string; price: number; label?: string }
    _dbWaitlistMode?: boolean
    _dbWaitlistNotice?: string
  }
}

export type ProductWithDbImages = Product & {
  _dbId?: number | string
  _dbThumbnailUrl?: string
  _dbDetailUrls?: string[]
  _dbTags?: string[]
  _dbDuration?: string
  _dbFaq?: Array<{ question: string; answer: string }>
  _dbFeatured?: boolean
  _dbStageLabel?: string
  _dbNextChange?: { startAt: string; price: number; label?: string }
  _dbWaitlistMode?: boolean
  _dbWaitlistNotice?: string
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
