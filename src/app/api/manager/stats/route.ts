import { NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload as getPayloadWithConfig } from 'payload'
import config from '@/payload.config'
import { subDays, format } from 'date-fns'

export async function GET() {
  try {
    const headersList = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayloadWithConfig({ config: payloadConfig })
    const { user } = await payload.auth({ headers: headersList })

    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    const sevenDaysAgo = subDays(today, 6)

    // Fetch 7-day site stats
    const statsResult = await payload.find({
      collection: 'site-stats',
      where: {
        date: { greater_than_equal: format(sevenDaysAgo, 'yyyy-MM-dd') },
      },
      sort: 'date',
      limit: 7,
    })

    // Fetch summary counts
    const [pendingOrders, cancelledOrders, pendingInquiries, totalCourses, totalPrograms, totalPosts, totalUsers] =
      await Promise.all([
        payload.count({ collection: 'orders', where: { status: { equals: 'pending' } } }),
        payload.count({ collection: 'orders', where: { status: { in: ['cancelled', 'returned'] } } }),
        payload.count({ collection: 'inquiries', where: { status: { equals: 'pending' } } }),
        payload.count({ collection: 'courses' }),
        payload.count({ collection: 'programs' }),
        payload.count({ collection: 'posts' }),
        payload.count({ collection: 'users' }),
      ])

    // Ensure all 7 days are represented (fill missing days with zeros)
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

    return NextResponse.json({
      success: true,
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
    })
  } catch (err) {
    console.error('[/api/manager/stats] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
