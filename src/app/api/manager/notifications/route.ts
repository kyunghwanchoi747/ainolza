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
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const page = parseInt(searchParams.get('page') ?? '1')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const where: any = {}
    if (unreadOnly) where.isRead = { equals: false }

    const result = await payload.find({
      collection: 'notifications',
      where,
      limit,
      page,
      sort: '-createdAt',
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error('[/api/manager/notifications] GET Error:', err)
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

    const body = (await req.json()) as any

    // 전체 읽음 처리
    if (body.all) {
      const unread = await payload.find({
        collection: 'notifications',
        where: { isRead: { equals: false } },
        limit: 200,
      })
      await Promise.all(
        unread.docs.map((n: any) =>
          payload.update({ collection: 'notifications', id: n.id, data: { isRead: true } }),
        ),
      )
      return NextResponse.json({ success: true })
    }

    // 단건 읽음 처리
    if (body.id) {
      await payload.update({
        collection: 'notifications',
        id: body.id,
        data: { isRead: true },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (err) {
    console.error('[/api/manager/notifications] PATCH Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
