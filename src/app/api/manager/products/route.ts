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
    const search = searchParams.get('search') ?? ''
    const status = searchParams.get('status') ?? ''

    const where: any = {}
    if (search) where.title = { like: search }
    if (status) where.status = { equals: status }

    const result = await payload.find({
      collection: 'products',
      where,
      page,
      limit,
      sort: '-createdAt',
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error('[/api/manager/products] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
