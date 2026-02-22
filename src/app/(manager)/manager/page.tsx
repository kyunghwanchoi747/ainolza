import { SummaryCards } from '@/components/manager/Dashboard/SummaryCards'
import { TodayStatus } from '@/components/manager/Dashboard/TodayStatus'
import { StatsChart } from '@/components/manager/Dashboard/StatsChart'
import { PeriodTable } from '@/components/manager/Dashboard/PeriodTable'
import { ContentFeed } from '@/components/manager/Dashboard/ContentFeed'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { subDays, format } from 'date-fns'
import { BarChart2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ManagerDashboard() {
  const headersList = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch stats
  let stats = {
    data: [] as any[],
    summary: {
      pendingOrders: 0,
      cancelledOrders: 0,
      pendingInquiries: 0,
      totalCourses: 0,
      totalPrograms: 0,
      totalPosts: 0,
      totalUsers: 0,
    },
  }

  try {
    const today = new Date()
    const sevenDaysAgo = subDays(today, 6)

    const [statsResult, pendingOrders, cancelledOrders, pendingInquiries, totalCourses, totalPrograms, totalPosts, totalUsers] =
      await Promise.all([
        payload.find({
          collection: 'site-stats',
          where: { date: { greater_than_equal: format(sevenDaysAgo, 'yyyy-MM-dd') } },
          sort: 'date',
          limit: 7,
        }),
        payload.count({ collection: 'orders', where: { status: { equals: 'pending' } } }),
        payload.count({ collection: 'orders', where: { status: { in: ['cancelled', 'returned'] } } }),
        payload.count({ collection: 'inquiries', where: { status: { equals: 'pending' } } }),
        payload.count({ collection: 'courses' }),
        payload.count({ collection: 'programs' }),
        payload.count({ collection: 'posts' }),
        payload.count({ collection: 'users' }),
      ])

    const statsMap = new Map(
      statsResult.docs.map((s: any) => [s.date?.split('T')[0] ?? s.date, s]),
    )
    const filledStats = Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(today, 6 - i), 'yyyy-MM-dd')
      const existing = statsMap.get(date) as any
      return {
        date,
        visitors: existing?.visitors ?? 0,
        pageViews: existing?.pageViews ?? 0,
        newOrders: existing?.newOrders ?? 0,
        revenue: existing?.revenue ?? 0,
      }
    })

    stats = {
      data: filledStats,
      summary: {
        pendingOrders: pendingOrders.totalDocs,
        cancelledOrders: cancelledOrders.totalDocs,
        pendingInquiries: pendingInquiries.totalDocs,
        totalCourses: totalCourses.totalDocs,
        totalPrograms: totalPrograms.totalDocs,
        totalPosts: totalPosts.totalDocs,
        totalUsers: totalUsers.totalDocs,
      },
    }
  } catch (err) {
    console.error('[Dashboard] Stats fetch error:', err)
  }

  // Fetch recent reviews and inquiries
  let recentReviews: any[] = []
  let recentInquiries: any[] = []
  try {
    const [reviewsRes, inquiriesRes] = await Promise.all([
      payload.find({ collection: 'reviews', limit: 5, sort: '-createdAt' }),
      payload.find({ collection: 'inquiries', limit: 5, sort: '-createdAt' }),
    ])
    recentReviews = reviewsRes.docs.map((r: any) => ({
      id: r.id,
      title: r.content?.slice(0, 40) ?? '(내용 없음)',
      date: r.createdAt,
      href: `/manager/shopping/reviews`,
    }))
    recentInquiries = inquiriesRes.docs.map((i: any) => ({
      id: i.id,
      title: i.subject ?? '(제목 없음)',
      date: i.createdAt,
      href: `/manager/shopping/inquiries`,
    }))
  } catch {
    // ignore
  }

  return (
    <div>
      {/* Site info banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: '총 회원수', value: `${stats.summary.totalUsers}명`, color: 'text-blue-600' },
          { label: '강의/프로그램', value: `${stats.summary.totalCourses + stats.summary.totalPrograms}개`, color: 'text-purple-600' },
          { label: '게시글', value: `${stats.summary.totalPosts}개`, color: 'text-green-600' },
          { label: '대기 주문', value: `${stats.summary.pendingOrders}건`, color: 'text-orange-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{stat.label}</p>
            <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <SummaryCards />
      <TodayStatus summary={stats.summary} />

      {/* Stats Chart + Period Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-700">방문자 통계</h2>
          </div>
          <StatsChart data={stats.data} />
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">기간별 분석</h2>
          <PeriodTable data={stats.data} />
        </div>
      </div>

      <ContentFeed recentPosts={recentReviews} recentInquiries={recentInquiries} />
    </div>
  )
}
