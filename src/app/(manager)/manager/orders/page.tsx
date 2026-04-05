import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' }> = {
  pending: { label: '주문접수', variant: 'warning' },
  paid: { label: '결제완료', variant: 'success' },
  active: { label: '이용중', variant: 'default' },
  completed: { label: '완료', variant: 'secondary' },
  refund_requested: { label: '환불요청', variant: 'destructive' },
  refunded: { label: '환불완료', variant: 'secondary' },
  failed: { label: '결제실패', variant: 'destructive' },
  cancelled: { label: '취소', variant: 'secondary' },
}

export default async function OrdersManagerPage() {
  let orders: any[] = []
  let totalCount = 0
  let paidTotal = 0
  let refundRequestCount = 0

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'orders',
      sort: '-createdAt',
      limit: 100,
    })
    orders = result.docs as any[]
    totalCount = result.totalDocs
    paidTotal = orders.filter(o => ['paid', 'active', 'completed'].includes(o.status)).reduce((sum: number, o: any) => sum + (o.amount || 0), 0)
    refundRequestCount = orders.filter(o => o.status === 'refund_requested').length
  } catch { /* DB not ready */ }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">주문 관리</h1>
        <p className="text-muted-foreground mt-1">주문 현황을 확인하고 관리하세요.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">전체 주문</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalCount}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600">매출</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{paidTotal.toLocaleString()}원</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-red-600">환불 요청</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{refundRequestCount}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-600">오늘 주문</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length}</div></CardContent></Card>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20"><p className="text-lg text-muted-foreground">아직 주문이 없습니다.</p></div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">주문번호</th>
                  <th className="text-left p-3 font-medium">구매자</th>
                  <th className="text-left p-3 font-medium">상품</th>
                  <th className="text-left p-3 font-medium">금액</th>
                  <th className="text-left p-3 font-medium">결제수단</th>
                  <th className="text-left p-3 font-medium">상태</th>
                  <th className="text-left p-3 font-medium">일시</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => {
                  const st = statusLabels[o.status] || statusLabels.pending
                  return (
                    <tr key={o.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/manager/orders/${o.id}`}>
                      <td className="p-3 font-mono text-xs text-blue-500 underline">{o.orderNumber}</td>
                      <td className="p-3">{o.buyerName}<br/><span className="text-xs text-muted-foreground">{o.buyerEmail}</span></td>
                      <td className="p-3">{o.productName}</td>
                      <td className="p-3 font-bold">{o.amount?.toLocaleString()}원</td>
                      <td className="p-3 text-muted-foreground">{o.payMethod || '-'}</td>
                      <td className="p-3"><Badge variant={st.variant}>{st.label}</Badge></td>
                      <td className="p-3 text-xs text-muted-foreground">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('ko-KR') : '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
