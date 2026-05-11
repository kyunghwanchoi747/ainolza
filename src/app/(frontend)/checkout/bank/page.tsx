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
  depositorName?: string
  buyerName?: string
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
      depositorName: d.depositorName,
      buyerName: d.buyerName,
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

  const initialDepositorName = order.depositorName || order.buyerName || ''

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[600px] mx-auto">
          <div className="mb-10">
            <p className="text-xs text-sub mb-2 tracking-wide">주문번호 {order.orderNumber}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2">입금 안내</h1>
            <p className="text-sub leading-relaxed">
              아래 계좌로 입금하신 후, 입금 확인이 완료되면 강의실 권한이 부여됩니다.
            </p>
          </div>

          {/* 주문 정보 */}
          <div className="py-5 border-t border-line">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-sub">주문 상품</span>
              <span className="text-sm font-medium text-ink text-right">{order.productName}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-sub">결제 금액</span>
              <span className="text-xl font-bold text-ink">{order.amount.toLocaleString()}원</span>
            </div>
          </div>

          {/* 입금 정보 + 입금자명 수정 UI */}
          <BankInfoClient
            orderId={String(order.id)}
            orderNumber={order.orderNumber}
            amount={order.amount}
            initialDepositorName={initialDepositorName}
            vbankDate={order.vbankDate}
          />

          {/* 안내 */}
          <div className="mt-10 pt-6 border-t border-line text-sm text-sub leading-relaxed space-y-1.5">
            <p>입금 확인은 영업시간 내에 이루어집니다.</p>
            <p>입금자명을 다르게 입력하시면 위 [수정] 버튼으로 변경해 주세요.</p>
            <p>마감 시간 내 입금되지 않으면 주문이 자동 취소됩니다.</p>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <Link
              href="/mypage"
              className="block w-full py-3 text-center border border-ink text-ink font-medium hover:bg-ink hover:text-white transition"
            >
              마이페이지에서 주문 확인
            </Link>
            <Link href="/" className="text-sm text-sub text-center pt-1 hover:text-ink transition">
              홈으로
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
