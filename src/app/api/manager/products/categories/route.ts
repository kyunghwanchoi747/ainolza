import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const categories = await payload.find({
      collection: 'product-categories',
      sort: 'order',
      limit: 100,
    })
    return NextResponse.json(categories)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const body: any = await req.json()
    const { name, slug, order } = body

    const created = await payload.create({
      collection: 'product-categories',
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        order: order || 0,
      },
    })
    return NextResponse.json(created)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    await payload.delete({ collection: 'product-categories', id })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
