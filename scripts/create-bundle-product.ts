/**
 * vibe-coding-advanced(심화) 상품을 복제하여 vibe-coding-bundle-2(번들) 상품 생성.
 *
 * 사용:
 *   npx cross-env PAYLOAD_CLI=1 NODE_ENV=production tsx scripts/create-bundle-product.ts
 *
 * 멱등성: 같은 slug 존재하면 skip.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const TARGET_SLUG = 'vibe-coding-bundle-2'

async function main() {
  console.log('[create-bundle] starting')

  const payload = await getPayload({ config })

  // 1) 기존 번들 있으면 skip
  const existing = await payload.find({
    collection: 'products',
    where: { slug: { equals: TARGET_SLUG } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) {
    console.log(`[create-bundle] '${TARGET_SLUG}' 이미 존재 — skip`)
    process.exit(0)
  }

  // 2) 심화 상품 원본 조회
  const source = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'vibe-coding-advanced' } },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  })
  const advanced = source.docs[0] as any
  if (!advanced) {
    console.error('[create-bundle] 원본 상품(vibe-coding-advanced)을 찾을 수 없음')
    process.exit(1)
  }

  console.log(`[create-bundle] 복제 원본: ${advanced.title} (id=${advanced.id})`)

  // 3) 번들 상품 데이터 구성 — 사용자가 admin에서 다듬을 수 있게 기본값만 채움
  const bundleData: Record<string, any> = {
    title: 'AI 바이브 코딩 입문 + 심화 번들 [2기]',
    slug: TARGET_SLUG,
    subtitle: advanced.subtitle || '입문 2주 + 심화 4주 풀코스',
    shortDescription: advanced.shortDescription || '입문부터 심화까지 한 번에',
    productType: 'bundle',
    category: '강의 번들',
    price: 219000,
    originalPrice: 298000,
    priceLabel: null,
    discountUntil: null,
    priceSchedule: [],

    // 액션 — enroll 경로(checkout으로 자동 변환)
    actions: [
      {
        label: '번들 신청하기',
        url: '/programs/vibe-coding/enroll',
        primary: true,
        external: false,
      },
    ],

    // 태그 — 번들 특성
    tags: [
      { label: '입문 + 심화' },
      { label: '6주 풀코스' },
      { label: '온라인' },
    ],
    duration: '6주 풀코스 (입문 2주 + 심화 4주)',
    faq: advanced.faq || [],

    // 강의실 권한 — 두 강의실 모두 부여
    grantedClassroomSlugs: [
      { slug: 'vibe-coding-101-2' },
      { slug: 'vibe-coding-advanced-2' },
    ],

    // 미디어 — 심화의 썸네일/상세 이미지를 참조 (사용자가 추후 교체 가능)
    thumbnail: typeof advanced.thumbnail === 'object' ? advanced.thumbnail?.id : advanced.thumbnail,
    detailImages: Array.isArray(advanced.detailImages)
      ? advanced.detailImages.map((di: any) => ({
          image: typeof di.image === 'object' ? di.image?.id : di.image,
        }))
      : [],

    // 노출 — draft로 시작 (홈/스토어에 안 보임, BundleUpsell 팝업으로만 진입)
    status: 'draft',
    order: 0,
    featured: false,

    // SEO
    seoType: 'Course',
    seoAuthor: advanced.seoAuthor || null,
  }

  // 4) 생성
  const created = await payload.create({
    collection: 'products',
    data: bundleData as any,
    overrideAccess: true,
  })

  console.log('[create-bundle] 생성 완료')
  console.log(`  id      : ${(created as any).id}`)
  console.log(`  slug    : ${(created as any).slug}`)
  console.log(`  status  : ${(created as any).status}`)
  console.log(`  price   : ${(created as any).price}`)
  console.log('어드민(/admin/collections/products)에서 다듬어주세요.')

  process.exit(0)
}

main().catch((e) => {
  console.error('[create-bundle] fatal:', e)
  process.exit(1)
})
