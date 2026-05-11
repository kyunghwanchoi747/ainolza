/**
 * 번들 상품(vibe-coding-bundle-2)의 priceSchedule을
 * 입문(vibe-coding-101) priceSchedule에 +219,000원을 더해 자동 동기화.
 *
 * 사용:
 *   npx cross-env PAYLOAD_CLI=1 NODE_ENV=production tsx scripts/sync-bundle-price-schedule.ts
 *
 * 정책:
 *  - 번들 가격 = 입문 단계가 + ADVANCED_ADDON (심화 추가비용)
 *  - 기존 priceSchedule은 모두 덮어씀
 *  - 라벨은 입문과 동일하게 유지 (디버그/UI 표시용)
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const ENTRY_SLUG = 'vibe-coding-101'
const BUNDLE_SLUG = 'vibe-coding-bundle-2'
const ADVANCED_ADDON = 219000 // 심화 추가비용

async function main() {
  console.log('[sync-bundle] starting')

  const payload = await getPayload({ config })

  // 1) 입문 priceSchedule 조회
  const entryRes = await payload.find({
    collection: 'products',
    where: { slug: { equals: ENTRY_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const entry = entryRes.docs[0] as any
  if (!entry) {
    console.error(`[sync-bundle] 입문 상품(${ENTRY_SLUG}) 없음`)
    process.exit(1)
  }
  const entrySchedule: any[] = Array.isArray(entry.priceSchedule) ? entry.priceSchedule : []
  if (entrySchedule.length === 0) {
    console.error(`[sync-bundle] 입문 priceSchedule이 비어 있음 — 입문 먼저 등록`)
    process.exit(1)
  }
  console.log(`[sync-bundle] 입문 priceSchedule ${entrySchedule.length}단계 발견`)

  // 2) 번들 상품 조회
  const bundleRes = await payload.find({
    collection: 'products',
    where: { slug: { equals: BUNDLE_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const bundle = bundleRes.docs[0] as any
  if (!bundle) {
    console.error(`[sync-bundle] 번들 상품(${BUNDLE_SLUG}) 없음 — 먼저 생성 필요`)
    process.exit(1)
  }
  console.log(`[sync-bundle] 번들 id=${bundle.id}`)

  // 3) 번들 priceSchedule 구성 — 입문 단계가 + 219,000
  const bundleSchedule = entrySchedule
    .filter((s) => s && s.startAt && typeof s.price === 'number')
    .map((s) => ({
      startAt: s.startAt,
      price: s.price + ADVANCED_ADDON,
      label: s.label || undefined,
    }))

  console.log('[sync-bundle] 적용할 번들 priceSchedule:')
  for (const s of bundleSchedule) {
    console.log(`  ${s.startAt}  ${s.price.toLocaleString()}원  ${s.label || ''}`)
  }

  // 4) 업데이트
  await payload.update({
    collection: 'products',
    id: bundle.id,
    data: { priceSchedule: bundleSchedule as any } as any,
    overrideAccess: true,
  })

  console.log('[sync-bundle] 완료')
  process.exit(0)
}

main().catch((e) => {
  console.error('[sync-bundle] fatal:', e)
  process.exit(1)
})
