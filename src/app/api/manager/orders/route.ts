import { NextRequest, NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

async function getAuth() {
  const headersList = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })
  return { payload, user }
}

export async function GET(req: NextRequest) {
  try {
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const status = searchParams.get('status') ?? ''
    const search = searchParams.get('search') ?? ''

    const where: any = {}
    if (status) where.status = { equals: status }
    if (search) where.id = { like: search }

    const STATUSES = ['pending', 'paid', 'preparing', 'shipping', 'delivered', 'cancelled', 'returned']

    const [result, totalAll, ...statusCounts] = await Promise.all([
      payload.find({
        collection: 'orders',
        where,
        page,
        limit,
        sort: '-createdAt',
        depth: 1,
      }),
      payload.find({ collection: 'orders', limit: 0 }),
      ...STATUSES.map((s) =>
        payload.find({ collection: 'orders', where: { status: { equals: s } }, limit: 0 }),
      ),
    ])

    const counts: Record<string, number> = { all: totalAll.totalDocs }
    STATUSES.forEach((s, i) => {
      counts[s] = statusCounts[i]?.totalDocs ?? 0
    })

    return NextResponse.json({ success: true, ...result, counts })
  } catch (err) {
    console.error('[/api/manager/orders] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await req.json() as { id: any; status: string }
    const updated = await payload.update({ collection: 'orders', id, data: { status } as any })
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error('[/api/manager/orders] PATCH Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
