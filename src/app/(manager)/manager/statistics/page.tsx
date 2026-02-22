import { getPayload } from 'payload'
import config from '@/payload.config'
import { PageHeader } from '@/components/manager/PageHeader'
import { StatsChart } from '@/components/manager/Dashboard/StatsChart'
import { PeriodTable } from '@/components/manager/Dashboard/PeriodTable'
import { subDays, format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function StatisticsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const today = new Date()
  const thirtyDaysAgo = subDays(today, 29)

  let stats: any[] = []
  try {
    const result = await payload.find({
      collection: 'site-stats',
      where: { date: { greater_than_equal: format(thirtyDaysAgo, 'yyyy-MM-dd') } },
      sort: 'date',
      limit: 30,
    })
    const statsMap = new Map(result.docs.map((s: any) => [s.date?.split('T')[0] ?? s.date, s]))
    stats = Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(today, 29 - i), 'yyyy-MM-dd')
      const existing = statsMap.get(date) as any
      return {
        date,
        visitors: existing?.visitors ?? 0,
        pageViews: existing?.pageViews ?? 0,
        newOrders: existing?.newOrders ?? 0,
        revenue: existing?.revenue ?? 0,
      }
    })
  } catch {}

  const totalVisitors = stats.reduce((s, r) => s + r.visitors, 0)
  const totalPageViews = stats.reduce((s, r) => s + r.pageViews, 0)
  const totalOrders = stats.reduce((s, r) => s + r.newOrders, 0)
  const totalRevenue = stats.reduce((s, r) => s + r.revenue, 0)

  return (
    <div>
      <PageHeader title="통계" description="최근 30일 사이트 통계" />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: '총 방문자', value: `${totalVisitors.toLocaleString()}명` },
          { label: '총 페이지뷰', value: `${totalPageViews.toLocaleString()}회` },
          { label: '총 주문수', value: `${totalOrders}건` },
          { label: '총 매출', value: `${totalRevenue.toLocaleString()}원` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
        <h2 className="text-sm font-bold text-slate-700 mb-4">방문자 / 페이지뷰 추이 (30일)</h2>
        <StatsChart data={stats.slice(-14)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-bold text-slate-700 mb-4">일별 상세 통계</h2>
        <PeriodTable data={stats.slice(-7)} />
      </div>
    </div>
  )
}
