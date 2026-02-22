import { NextRequest, NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest) {
  try {
    const headersList = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers: headersList })

    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const status = searchParams.get('status') ?? ''

    const where: any = {}
    if (status) where.status = { equals: status }

    const result = await payload.find({
      collection: 'orders',
      where,
      page,
      limit,
      sort: '-createdAt',
      depth: 1,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error('[/api/manager/orders] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const headersList = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers: headersList })

    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await req.json() as any
    const updated = await payload.update({ collection: 'orders', id, data: { status } })
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error('[/api/manager/orders] PATCH Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
