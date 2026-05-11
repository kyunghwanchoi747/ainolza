import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { BankInfoClient } from './bank-info-client'

export const dynamic = 'force-dynamic'

type OrderInfo = {
  id: number | string
  orderNumber: string
  status: string
  productName: string
  amount: number
  vbankName?: string
  vbankNum?: string
  vbankDate?: string
} | null

async function getOrder(orderNumber: string): Promise<OrderInfo> {
  if (!orderNumber) return null
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const d = result.docs[0] as any
    if (!d) return null
    return {
      id: d.id,
      orderNumber: d.orderNumber,
      status: d.status,
      productName: d.productName,
      amount: d.amount,
      vbankName: d.vbankName,
      vbankNum: d.vbankNum,
      vbankDate: d.vbankDate,
    }
  } catch {
    return null
  }
}

export default async function BankCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>
}) {
  const { orderNumber } = await searchParams
  if (!orderNumber) notFound()

  const order = await getOrder(orderNumber)
  if (!order) notFound()

  const depositorName = order.orderNumber.slice(-6)

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[600px] mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <span className="text-3xl">🏦</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2">입금 대기 중</h1>
            <p className="text-sub">
              아래 계좌로 입금해 주시면 입금 확인 후 강의실 권한이 부여됩니다.
            </p>
          </div>

          {/* 주문 정보 */}
          <div className="p-5 rounded-2xl bg-surface border border-line mb-4">
            <div className="text-xs text-sub mb-1">주문 상품</div>
            <div className="font-bold text-ink mb-3">{order.productName}</div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-sub">결제금액</span>
              <span className="text-2xl font-extrabold text-brand">
                {order.amount.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 입금 정보 — 클라이언트 컴포넌트로 복사 버튼 포함 */}
          <BankInfoClient
            orderNumber={order.orderNumber}
            amount={order.amount}
            depositorName={depositorName}
            vbankDate={order.vbankDate}
          />

          {/* 안내 사항 */}
          <div className="mt-6 p-5 rounded-2xl bg-amber-50 border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2 text-sm">⚠️ 꼭 확인해 주세요</h3>
            <ul className="text-sm text-amber-900 space-y-1.5 leading-relaxed">
              <li>• 입금자명을 <strong>{depositorName}</strong>로 입력해 주세요. (주문번호 끝 6자리)</li>
              <li>• 입금 확인 후 영업시간 내 강의실 권한이 부여됩니다.</li>
              <li>• 마감 시간 내 입금이 확인되지 않으면 주문이 자동 취소됩니다.</li>
              <li>• 입금자명이 다르면 확인이 늦어질 수 있습니다.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-2 text-center">
            <Link
              href="/mypage"
              className="block w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition"
            >
              마이페이지에서 주문 확인
            </Link>
            <Link href="/" className="text-sm text-sub underline pt-2">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
