import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { WaitlistForm } from './waitlist-form'

export const dynamic = 'force-dynamic'

/**
 * 대기 신청 페이지 /waitlist/[slug]
 *
 * - 상품이 waitlistMode=true 일 때만 정상 표시.
 * - 비로그인도 신청 가능. 로그인 상태면 이름·이메일·휴대폰 자동 채움.
 */
export default async function WaitlistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const product = result.docs[0] as any
  if (!product) notFound()

  // waitlistMode가 아니면 결제 페이지로 안내
  if (!product.waitlistMode) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-ink mb-3">현재 모집 중인 상품입니다</h1>
          <p className="text-sm text-sub mb-6">대기 신청이 아닌 결제 페이지에서 바로 신청하실 수 있습니다.</p>
          <Link
            href={`/checkout?slug=${encodeURIComponent(slug)}`}
            className="inline-block px-6 py-3 rounded-full bg-ink text-white text-sm font-semibold hover:bg-black transition-colors"
          >
            결제 페이지로 이동
          </Link>
        </div>
      </div>
    )
  }

  // 현재 로그인 회원 정보 (자동 채움용)
  let currentUser: { name?: string; email?: string; phone?: string } | null = null
  try {
    const { user } = await payload.auth({ headers: await import('next/headers').then((m) => m.headers()) })
    if (user) {
      currentUser = {
        name: (user as any).name || '',
        email: (user as any).email || '',
        phone: (user as any).phone || '',
      }
    }
  } catch {
    // 비로그인 OK
  }

  const notice: string = product.waitlistNotice ||
    '다음 기수 모집이 시작되면 가장 먼저 안내드립니다. 모집 일정과 가격은 변동될 수 있습니다.'

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-xl mx-auto px-5 sm:px-6 py-20">
        <div className="mb-10">
          <Link href={`/store/${slug}`} className="text-xs text-sub hover:text-ink transition-colors">
            ← 상품 정보로
          </Link>
        </div>

        <p className="text-xs tracking-[0.2em] text-brand uppercase mb-3">WAITLIST</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-3 leading-tight">
          {product.title} 대기 신청
        </h1>
        <p className="text-sm text-sub leading-relaxed mb-2 break-keep">{notice}</p>

        {/* 현재 가격 안내 (참고용) */}
        {product.price ? (
          <div className="mt-6 mb-8 rounded-2xl border border-line p-4 bg-surface text-sm">
            <p className="text-sub mb-1">현재 기수 판매가 (참고)</p>
            <p className="text-ink font-bold">
              {product.price.toLocaleString('ko-KR')}원
              <span className="text-xs font-normal text-sub ml-2">· 다음 기수는 인상될 수 있습니다</span>
            </p>
          </div>
        ) : null}

        <WaitlistForm
          productSlug={slug}
          productName={product.title || slug}
          defaultName={currentUser?.name || ''}
          defaultEmail={currentUser?.email || ''}
          defaultPhone={currentUser?.phone || ''}
        />
      </main>
    </div>
  )
}
