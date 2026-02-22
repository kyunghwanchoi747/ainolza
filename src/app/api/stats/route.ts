import { getPayload } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function POST(_req: Request) {
  try {
    const payload = await getPayload()
    const now = new Date()
    // Set to local date or UTC date? Let's use UTC 00:00 for the record date
    const todayStr = now.toISOString().split('T')[0]
    const dateObj = new Date(todayStr)

    const existing = await payload.find({
      collection: 'site-stats',
      where: {
        date: {
          equals: dateObj,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]
      await payload.update({
        collection: 'site-stats',
        id: doc.id,
        data: {
          pageViews: (doc.pageViews || 0) + 1,
        },
      })
    } else {
      await payload.create({
        collection: 'site-stats',
        data: {
          date: todayStr,
          pageViews: 1,
          visitors: 1,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const payload = await getPayload()

    // Fetch stats for the last 7 days
    const stats = await payload.find({
      collection: 'site-stats',
      sort: '-date',
      limit: 7,
    })

    // Fetch real-time summary for dashboard
    const [pendingInquiries, pendingOrders, totalCourses, totalPrograms, totalPosts] =
      await Promise.all([
        payload.count({
          collection: 'inquiries',
          where: { status: { equals: 'pending' } },
        }),
        payload.count({
          collection: 'orders',
          where: { status: { equals: 'pending' } },
        }),
        payload.count({ collection: 'courses' }),
        payload.count({ collection: 'programs' }),
        payload.count({ collection: 'community-posts' }),
      ])

    return NextResponse.json({
      success: true,
      data: stats.docs.reverse(),
      summary: {
        pendingInquiries: pendingInquiries.totalDocs,
        pendingOrders: pendingOrders.totalDocs,
        totalCourses: totalCourses.totalDocs,
        totalPrograms: totalPrograms.totalDocs,
        totalPosts: totalPosts.totalDocs,
      },
    })
  } catch (error) {
    console.error('Stats GET Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
