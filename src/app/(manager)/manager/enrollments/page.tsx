import { getPayloadClient } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' }> = {
  pending: { label: '대기', variant: 'warning' },
  confirmed: { label: '확인', variant: 'default' },
  paid: { label: '결제완료', variant: 'success' },
  cancelled: { label: '취소', variant: 'destructive' },
}

export default async function EnrollmentsPage() {
  let enrollments: Array<{
    id: string
    name: string
    phone: string
    email: string
    program: string
    message?: string
    status: string
    createdAt: string
  }> = []
  let totalCount = 0

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'enrollments',
      sort: '-createdAt',
      limit: 100,
    })
    enrollments = result.docs.map((doc: any) => ({
      id: String(doc.id),
      name: String(doc.name || ''),
      phone: String(doc.phone || ''),
      email: String(doc.email || ''),
      program: String(doc.program || ''),
      message: String(doc.message || ''),
      status: String(doc.status || 'pending'),
      createdAt: String(doc.createdAt || ''),
    }))
    totalCount = result.totalDocs
  } catch {
    // DB not ready
  }

  const pendingCount = enrollments.filter(e => e.status === 'pending').length
  const confirmedCount = enrollments.filter(e => e.status === 'confirmed').length
  const paidCount = enrollments.filter(e => e.status === 'paid').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">수강신청 관리</h1>
        <p className="text-muted-foreground mt-1">수강 신청 현황을 확인하고 관리하세요.</p>
      </div>

      {/* 통계 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">전체 신청</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">확인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{confirmedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">결제완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* 신청 목록 */}
      {enrollments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">아직 수강 신청이 없습니다.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">이름</th>
                  <th className="text-left p-3 font-medium">연락처</th>
                  <th className="text-left p-3 font-medium">이메일</th>
                  <th className="text-left p-3 font-medium">프로그램</th>
                  <th className="text-left p-3 font-medium">상태</th>
                  <th className="text-left p-3 font-medium">신청일</th>
                  <th className="text-left p-3 font-medium">문의</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map(e => {
                  const status = statusLabels[e.status] || statusLabels.pending
                  return (
                    <tr key={e.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{e.name}</td>
                      <td className="p-3 text-muted-foreground">{e.phone}</td>
                      <td className="p-3 text-muted-foreground">{e.email}</td>
                      <td className="p-3">{e.program}</td>
                      <td className="p-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {e.createdAt ? new Date(e.createdAt).toLocaleDateString('ko-KR') : '-'}
                      </td>
                      <td className="p-3 text-muted-foreground text-xs max-w-[200px] truncate">
                        {e.message || '-'}
                      </td>
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
