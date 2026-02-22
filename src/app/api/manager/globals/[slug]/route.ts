import { NextRequest, NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

const ALLOWED_GLOBALS = ['shop-settings', 'seo-settings', 'payment-settings', 'message-settings', 'main-nav']

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    if (!ALLOWED_GLOBALS.includes(slug)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const headersList = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers: headersList })

    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await payload.findGlobal({ slug: slug as any })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(`[/api/manager/globals/${(await params).slug}] GET Error:`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    if (!ALLOWED_GLOBALS.includes(slug)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const headersList = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers: headersList })

    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = await payload.updateGlobal({ slug: slug as any, data: body })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(`[/api/manager/globals/${(await params).slug}] PATCH Error:`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
