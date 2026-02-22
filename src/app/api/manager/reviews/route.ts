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

    const result = await payload.find({
      collection: 'reviews',
      page,
      limit,
      sort: '-createdAt',
      depth: 1,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error('[/api/manager/reviews] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
