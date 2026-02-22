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

export async function GET(req: NextRequest) {
  try {
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const search = searchParams.get('search') ?? ''
    const status = searchParams.get('status') ?? ''
    const categoryId = searchParams.get('category') ?? ''

    const where: any = {}
    if (search) where.title = { like: search }
    if (status) where.status = { equals: status }
    if (categoryId) where.category = { equals: parseInt(categoryId) }

    const [result, countAll, countPublished, countSoldOut, countHidden] = await Promise.all([
      payload.find({
        collection: 'products',
        where,
        page,
        limit,
        sort: '-createdAt',
        depth: 1,
      }),
      payload.find({ collection: 'products', limit: 0 }),
      payload.find({ collection: 'products', where: { status: { equals: 'published' } }, limit: 0 }),
      payload.find({ collection: 'products', where: { status: { equals: 'sold_out' } }, limit: 0 }),
      payload.find({ collection: 'products', where: { status: { equals: 'hidden' } }, limit: 0 }),
    ])

    return NextResponse.json({
      success: true,
      ...result,
      counts: {
        all: countAll.totalDocs,
        published: countPublished.totalDocs,
        sold_out: countSoldOut.totalDocs,
        hidden: countHidden.totalDocs,
      },
    })
  } catch (err) {
    console.error('[/api/manager/products] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as {
      title?: string; price?: number; stock?: number; category?: number
      status?: string; description?: string; imageId?: number
    }
    const { title, price, stock, category, status, description, imageId } = body

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }

    const data: any = {
      title,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      status: status ?? 'published',
    }
    if (category) data.category = Number(category)
    if (description) data.description = textToLexical(description)
    if (imageId) data.images = [Number(imageId)]

    const product = await payload.create({ collection: 'products', data })
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error('[/api/manager/products POST] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
