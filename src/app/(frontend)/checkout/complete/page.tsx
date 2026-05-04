import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type OrderInfo = {
  orderNumber?: string
  status?: string
  productName?: string
  amount?: number
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
    const doc = result.docs[0] as any
    if (!doc) return null
    return {
      orderNumber: doc.orderNumber,
      status: doc.status,
      productName: doc.productName,
      amount: doc.amount,
      vbankName: doc.vbankName,
      vbankNum: doc.vbankNum,
      vbankDate: doc.vbankDate,
    }
  } catch {
    return null
  }
}

function formatExpiry(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default async function CompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>
}) {
  const { orderNumber: orderNumberParam } = await searchParams
  const orderNumber = orderNumberParam || ''
  const order = await getOrder(orderNumber)

  // 가상계좌 발급 상태 — 입금 대기
  const isVbank =
    order &&
    order.status === 'pending' &&
    !!order.vbankNum &&
    !!order.vbankName

  if (isVbank) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <div className="max-w-[520px] w-full text-center">
          <div className="text-5xl mb-4">🏦</div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink mb-3">
            가상계좌가 발급되었습니다
          </h1>
          <p className="text-body text-sm mb-8 leading-relaxed">
            아래 계좌로 입금하시면 자동으로 결제가 완료되어
            <br />
            신청이 확정됩니다.
          </p>

          <div className="text-left rounded-2xl border-2 border-[#D4756E] bg-[#FFF1F0] p-5 mb-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sub text-sm">은행</span>
              <span className="font-bold text-ink">{order.vbankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sub text-sm">계좌번호</span>
              <span className="font-mono font-bold text-ink text-base tracking-wider">
                {order.vbankNum}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sub text-sm">입금금액</span>
              <span className="font-bold text-brand text-lg">
                {(order.amount ?? 0).toLocaleString()}원
              </span>
            </div>
            {order.vbankDate && (
              <div className="flex justify-between items-center">
                <span className="text-sub text-sm">입금기한</span>
                <span className="text-brand text-sm font-medium">
                  {formatExpiry(order.vbankDate)} 까지
                </span>
              </div>
            )}
            {order.orderNumber && (
              <div className="flex justify-between items-center pt-2 border-t border-[#D4756E]/30">
                <span className="text-sub text-xs">주문번호</span>
                <span className="font-mono text-xs text-sub">
                  {order.orderNumber}
                </span>
              </div>
            )}
          </div>

          <div className="text-left rounded-xl bg-[#fafafa] p-4 mb-6 text-xs text-sub leading-relaxed space-y-1">
            <p>• 입금 확인은 자동으로 처리되며 보통 1~5분 이내에 완료됩니다.</p>
            <p>• 입금기한이 지나면 가상계좌가 자동 만료되어 입금되지 않습니다.</p>
            <p>• 동일한 안내를 이메일로도 발송해드렸습니다.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/mypage"
              className="px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all text-sm"
            >
              마이페이지에서 확인
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-line text-ink font-bold rounded-xl hover:bg-surface transition-all text-sm"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 카드/계좌이체/간편결제 등 즉시 결제 완료
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="max-w-[500px] text-center">
        <div className="text-6xl mb-6">&#10003;</div>
        <h1 className="text-3xl font-bold text-ink mb-4">주문이 완료되었습니다</h1>
        {orderNumber && (
          <p className="text-sub text-sm mb-2">
            주문번호: <span className="font-mono text-ink">{orderNumber}</span>
          </p>
        )}
        <p className="text-body text-sm mb-8">
          결제 확인 후 콘텐츠 이용이 가능합니다.
          <br />
          문의사항은 카카오톡 오픈채팅으로 연락해주세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/mypage"
            className="px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all text-sm"
          >
            마이페이지
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-line text-ink font-bold rounded-xl hover:bg-surface transition-all text-sm"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
