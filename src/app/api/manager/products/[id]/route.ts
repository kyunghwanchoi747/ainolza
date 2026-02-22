import { NextRequest, NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { textToLexical } from '@/lib/lexical'

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
    const product = await payload.findByID({
      collection: 'products',
      id: parseInt(id),
      depth: 1,
    })

    return NextResponse.json(product)
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
      title?: string; price?: number; stock?: number; category?: number
      status?: string; description?: string; imageId?: number
    }
    const { title, price, stock, category, status, description, imageId } = body

    const data: any = {}
    if (title !== undefined) data.title = title
    if (price !== undefined) data.price = Number(price)
    if (stock !== undefined) data.stock = Number(stock)
    if (status !== undefined) data.status = status
    if (category !== undefined) data.category = category ? Number(category) : null
    if (description !== undefined) data.description = description ? textToLexical(description) : null
    if (imageId !== undefined) data.images = imageId ? [Number(imageId)] : []

    const product = await payload.update({
      collection: 'products',
      id: parseInt(id),
      data,
      depth: 1,
    })

    return NextResponse.json(product)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await payload.delete({ collection: 'products', id: parseInt(id) })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
