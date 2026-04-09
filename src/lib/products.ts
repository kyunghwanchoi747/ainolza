/**
 * 상품 (강의 / 전자책 / 종이책) 메타데이터
 *
 * ▶ 새 상품 추가하는 법
 *   1. 캔바 등에서 상세 이미지 만들기 (1장 또는 여러 장)
 *   2. public/store/{slug}/ 폴더 만들기
 *   3. 그 폴더에 thumbnail.png + detail-1.png (필요시 detail-2.png, detail-3.png ...) 넣기
 *   4. 아래 PRODUCTS 배열에 항목 1개 추가
 *   5. git push → 자동 배포 → 끝
 *
 * ▶ 이미지 파일명 규칙
 *   - thumbnail.png : 카드 썸네일 (목록에 노출)
 *   - detail-1.png ~ detail-N.png : 상세 페이지 이미지 (위에서 아래로 N개 노출)
 *   - 확장자는 .png / .jpg / .webp 모두 가능 (아래 imageExt 옵션으로 지정)
 */

export type ProductAction = {
  label: string
  url: string
  primary?: boolean
  external?: boolean // 새 탭으로 열기
}

export type Product = {
  slug: string
  type: 'class' | 'book' | 'ebook' | 'bundle'
  category: string // 카드 상단 라벨 (예: '강의', '전자책', '종이책 / 전자책')

  // 카드 / 헤더에 표시
  title: string
  subtitle?: string // 한 줄 부제
  shortDescription?: string // 카드용 짧은 소개

  // 가격
  price?: number // 원 단위. 0이면 외부 판매(교보문고 등)
  originalPrice?: number // 정가 (할인 전)
  priceLabel?: string // 가격 대신 표시할 텍스트 (예: '교보문고 판매 중')
  discountUntil?: string // YYYY-MM-DD, 있으면 D-N 카운트다운 표시

  // 액션 버튼 (여러 개 가능)
  actions: ProductAction[]

  // 강의실 연결 (수강생 전용 공간)
  classroomSlug?: 'vibe-coding-101' | 'vibe-coding-advanced'

  // 이미지
  detailImageCount?: number // detail-1.png ~ detail-{N}.png. 미지정 시 1
  imageExt?: 'png' | 'jpg' | 'webp' // 미지정 시 png

  // 노출 제어
  hidden?: boolean // true면 목록에서 숨김 (내부 테스트용)
  order?: number // 정렬 가중치 (작을수록 앞)

  // SEO (선택)
  seo?: {
    type?: 'Book' | 'Course' | 'Product'
    author?: string
    isbn?: string
  }
}

// ⚠️ 가격/제목 등 진짜 데이터는 모두 DB(Payload Products 컬렉션)에 있음.
// 이 파일은 DB 조회 실패 시의 최소 폴백일 뿐 — 정확한 가격은 두지 않음.
// 실제 운영 데이터는 admin → Products 에서 관리.
export const PRODUCTS: Product[] = [
  {
    slug: 'vibe-coding-advanced',
    type: 'class',
    category: '강의',
    title: 'AI 바이브 코딩 [심화]\n백지 위의 바이브코더',
    subtitle: '백지에서 시작하는 4주 심화 과정',
    shortDescription: '코딩 0인 분도 4주만에 자기 사이트 운영',
    actions: [
      { label: '수강 신청하기', url: '/programs/vibe-coding/enroll?slug=vibe-coding-advanced', primary: true },
    ],
    classroomSlug: 'vibe-coding-advanced',
    order: 1,
    seo: { type: 'Course' },
  },
  {
    slug: 'vibe-coding-101',
    type: 'class',
    category: '강의',
    title: 'AI 바이브 코딩 [입문]\n자동 수익 웹사이트 구축 실전',
    subtitle: '코딩 0인 분도 4주만에 자기 사이트 운영',
    shortDescription: 'AI로 만드는 자동 수익 웹사이트 구축',
    actions: [
      { label: '수강 신청하기', url: '/programs/vibe-coding/enroll?slug=vibe-coding-101', primary: true },
    ],
    classroomSlug: 'vibe-coding-101',
    order: 2,
    seo: { type: 'Course' },
  },
  {
    slug: 'uncomfortable-ai',
    type: 'book',
    category: '전자책 / 종이책',
    title: '불편한 AI',
    subtitle: '평범한 사람을 위한 AI 리터러시',
    shortDescription: 'Now or Never. 멈출 수 없는 변화 속에서',
    priceLabel: '교보문고 판매 중',
    actions: [
      {
        label: '교보문고에서 보기',
        url: 'https://search.kyobobook.co.kr/search?keyword=%EB%B6%88%ED%8E%B8%ED%95%9C+AI+%EC%B5%9C%EA%B2%BD%ED%99%98',
        primary: true,
        external: true,
      },
    ],
    detailImageCount: 1,
    order: 3,
    seo: { type: 'Book', author: '최경환' },
  },
  {
    slug: 'personal-intelligence',
    type: 'ebook',
    category: '전자책',
    title: '퍼스널 인텔리전스',
    subtitle: 'Google Workspace × Gemini 활용서',
    shortDescription: '실무자를 위한 AI 워크플로우 가이드',
    priceLabel: '교보문고 판매 중',
    actions: [
      {
        label: '교보문고에서 보기',
        url: 'https://search.kyobobook.co.kr/search?keyword=%ED%8D%BC%EC%8A%A4%EB%84%90+%EC%9D%B8%ED%85%94%EB%A6%AC%EC%A0%84%EC%8A%A4',
        primary: true,
        external: true,
      },
    ],
    detailImageCount: 9,
    order: 4,
    seo: { type: 'Book', author: '최경환' },
  },
]

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getVisibleProducts(): Product[] {
  return PRODUCTS
    .filter((p) => !p.hidden)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

/**
 * D-day 계산. discountUntil 이 있고 미래 날짜인 경우 양수 N 반환.
 * 없거나 지났으면 null.
 */
export function getDday(discountUntil?: string): number | null {
  if (!discountUntil) return null
  const target = new Date(discountUntil + 'T23:59:59+09:00')
  const now = new Date()
  const diff = Math.ceil((target.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  return diff >= 0 ? diff : null
}
