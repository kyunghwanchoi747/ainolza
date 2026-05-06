/**
 * 레거시 구매자 임포트 — 회원_*_구매자.md 파일을 직접 읽어 prod D1에 LEGACY_ Order 생성.
 *
 * 사용 (사용자 PC에서):
 *   npx wrangler whoami      (인증 확인)
 *   DRY_RUN=1 npx cross-env PAYLOAD_CLI=1 NODE_ENV=production tsx scripts/import-legacy-buyers.ts
 *   npx cross-env PAYLOAD_CLI=1 NODE_ENV=production tsx scripts/import-legacy-buyers.ts
 *
 * 정책:
 *  - 이메일 정확 일치하는 기존 회원만 매핑 (없으면 skip — 신규 회원 생성 X)
 *  - status='paid', orderNumber=LEGACY_*** 로 Order 생성
 *  - paidAt = 원본 주문일 → 자동 만료 상태 (수강기간 종료, 후기 작성만 가능)
 *  - context.skipNotify=true 로 호출 → afterChange hook의 메일 발송 차단
 *  - 같은 LEGACY_orderNumber 또는 같은 회원/같은 productSlug paid 주문 있으면 skip (idempotent)
 *  - '비고' 컬럼에 '취소' 단어 포함 행은 자동 제외
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const DRY_RUN = process.env.DRY_RUN === '1'

type Row = {
  externalOrderNumber: string
  orderDate: Date
  buyerName: string
  email: string
  phone: string
  optionName: string
  amount: number
  cancelled: boolean
}

type ProductMapping = {
  match: (option: string) => boolean
  productSlug: string
  productName: string
  productType: 'class' | 'ebook' | 'book' | 'bundle'
}

const PRODUCT_MAPPINGS: ProductMapping[] = [
  // 불편한 AI 종이책
  {
    match: (o) => /불편한.?AI.*종이책/.test(o),
    productSlug: 'uncomfortable-ai',
    productName: '불편한 AI (종이책)',
    productType: 'book',
  },
  // 불편한 AI 전자책 (얼리버드 포함)
  {
    match: (o) => /불편한.?AI.*전자책/.test(o),
    productSlug: 'uncomfortable-ai-ebook',
    productName: '불편한 AI (전자책)',
    productType: 'ebook',
  },
  // 퍼스널 인텔리전스 (인텔리전스/인텔리젠스 모두)
  {
    match: (o) => /퍼스널.{0,3}인텔리[전젠]스/.test(o),
    productSlug: 'personal-intelligence',
    productName: '퍼스널 인텔리전스',
    productType: 'ebook',
  },
]

function pickMapping(option: string): ProductMapping | null {
  for (const m of PRODUCT_MAPPINGS) {
    if (m.match(option)) return m
  }
  return null
}

/**
 * 회원_*_구매자.md 파일에서 마크다운 표 행을 추출.
 * 표 헤더: | 주문번호 | 주문일 | 이름 | 이메일 | 연락처 | 옵션(또는 상품/옵션) | 결제금액 | 비고 |
 */
function parseMd(filePath: string): Row[] {
  if (!fs.existsSync(filePath)) {
    console.error(`[parse] file not found: ${filePath}`)
    return []
  }
  const text = fs.readFileSync(filePath, 'utf8')
  const rows: Row[] = []
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line.startsWith('|')) continue
    // 구분선(|---|---|...) 스킵
    if (/^\|\s*-+\s*\|/.test(line)) continue
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())
    if (cells.length < 7) continue
    const [orderNumber, dateStr, name, email, phone, option, amountStr, notes = ''] = cells
    // 헤더 행 스킵
    if (orderNumber === '주문번호') continue
    const t = new Date(dateStr.replace(' ', 'T'))
    if (isNaN(t.getTime())) continue
    const amount = Number((amountStr || '').replace(/[^0-9]/g, '')) || 0
    const cancelled = /취소/.test(notes)
    rows.push({
      externalOrderNumber: orderNumber,
      orderDate: t,
      buyerName: name,
      email: email.toLowerCase(),
      phone,
      optionName: option,
      amount,
      cancelled,
    })
  }
  return rows
}

async function main() {
  console.log('[import] starting. DRY_RUN =', DRY_RUN)

  const root = process.cwd()
  const file1 = path.resolve(root, '회원_불편한AI_구매자.md')
  const file2 = path.resolve(root, '회원_퍼스널인텔리전스_구매자.md')

  const rows1 = parseMd(file1)
  const rows2 = parseMd(file2)
  const rows = [...rows1, ...rows2]
  console.log(`[import] parsed: 불편한AI=${rows1.length}, 퍼스널=${rows2.length}, total=${rows.length}`)
  if (rows.length === 0) {
    console.error('[import] no rows parsed. check md file format.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  let totalRows = 0
  let skipCancelled = 0
  let skipNoMapping = 0
  let skipNoMember = 0
  let skipDuplicate = 0
  let created = 0
  const skippedEmails: string[] = []

  for (const row of rows) {
    totalRows++
    if (row.cancelled) {
      skipCancelled++
      continue
    }
    const mapping = pickMapping(row.optionName)
    if (!mapping) {
      skipNoMapping++
      continue
    }

    // 회원 조회
    const userResult = await payload.find({
      collection: 'users',
      where: { email: { equals: row.email } },
      limit: 1,
      overrideAccess: true,
    })
    const user = userResult.docs[0] as any
    if (!user) {
      skipNoMember++
      skippedEmails.push(`${row.email} (${mapping.productSlug})`)
      continue
    }

    const orderNumber = `LEGACY_${mapping.productSlug.toUpperCase().replace(/-/g, '_')}_${row.externalOrderNumber}`

    // 같은 LEGACY 주문 있으면 skip
    const existingByNumber = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      limit: 1,
      overrideAccess: true,
    })
    if (existingByNumber.totalDocs > 0) {
      skipDuplicate++
      continue
    }

    // 같은 회원이 같은 productSlug paid 주문 있으면 skip
    const existingByProduct = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { user: { equals: user.id } },
          { productSlug: { equals: mapping.productSlug } },
          { status: { equals: 'paid' } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (existingByProduct.totalDocs > 0) {
      skipDuplicate++
      continue
    }

    if (DRY_RUN) {
      console.log(
        `[dry] ${row.email} → ${mapping.productSlug} (${orderNumber}, ${row.amount}원, ${row.orderDate.toISOString().slice(0, 10)})`,
      )
      created++
      continue
    }

    try {
      await payload.create({
        collection: 'orders',
        data: {
          orderNumber,
          buyerName: row.buyerName || user.name || row.email.split('@')[0],
          buyerEmail: row.email,
          buyerPhone: row.phone,
          user: user.id,
          productName: mapping.productName,
          productSlug: mapping.productSlug,
          productType: mapping.productType,
          amount: row.amount,
          status: 'paid' as const,
          paidAt: row.orderDate.toISOString() as any, // 원본 주문일 → 자동 만료
          adminMemo: `레거시 임포트 — 외부 주문 ${row.externalOrderNumber} (${row.optionName}). 후기 작성 전용.`,
        } as any,
        overrideAccess: true,
        // afterChange hook의 메일 발송 차단
        context: { skipNotify: true },
      })
      created++
    } catch (e) {
      console.error('[import] create failed', row.email, mapping.productSlug, (e as Error).message)
    }
  }

  console.log('========== import summary ==========')
  console.log('total rows           :', totalRows)
  console.log('skip cancelled       :', skipCancelled)
  console.log('skip no mapping      :', skipNoMapping)
  console.log('skip no member       :', skipNoMember)
  console.log('skip duplicate       :', skipDuplicate)
  console.log('created (or dry-run) :', created)
  console.log('====================================')
  if (skipNoMember > 0) {
    console.log(`\n[non-member emails — first 30 of ${skippedEmails.length}]`)
    skippedEmails.slice(0, 30).forEach((e) => console.log('  ', e))
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('[import] fatal:', err)
  process.exit(1)
})
