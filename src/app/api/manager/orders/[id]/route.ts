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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const order = await payload.findByID({
      collection: 'orders',
      id,
      depth: 2,
    })

    return NextResponse.json(order)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json() as {
      status?: string
      shippingInfo?: {
        receiverName?: string
        receiverPhone?: string
        address?: string
        memo?: string
        trackingNumber?: string
      }
    }

    const data: any = {}
    if (body.status !== undefined) data.status = body.status
    if (body.shippingInfo !== undefined) data.shippingInfo = body.shippingInfo

    const updated = await payload.update({
      collection: 'orders',
      id,
      data,
      depth: 2,
    })

    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
