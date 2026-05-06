import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')

    if (id) {
      const product = await payload.findByID({ collection: 'products', id, depth: 1 })
      return NextResponse.json(product)
    }
    if (slug) {
      const products = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
      })
      return NextResponse.json(products.docs[0] || null)
    }

    const products = await payload.find({
      collection: 'products',
      sort: '-updatedAt',
      limit: 100,
      depth: 1,
    })
    return NextResponse.json(products)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError
  try {
    const payload = await getPayloadClient()
    const body: any = await req.json()
    const { title, slug, description, price, category, thumbnail, content, status, featured, productType, ebookFile } = body

    // ebookFile은 ebooks 컬렉션 row의 정수 id — string으로 들어오면 number로 캐스팅
    const ebookFileId =
      productType === 'ebook' && ebookFile ? Number(ebookFile) || null : null

    const created = await (payload as any).create({
      collection: 'products',
      data: {
        title: title || 'Untitled',
        slug: slug || `product-${Date.now()}`,
        description,
        price: price || 0,
        category,
        thumbnail,
        content,
        status: status || 'draft',
        featured: featured || false,
        productType: productType || 'class',
        ebookFile: ebookFileId,
      },
    })
    return NextResponse.json(created)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError
  try {
    const payload = await getPayloadClient()
    const body: any = await req.json()
    const { id, ...fields } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updateData[key] = value
    }
    // ebookFile relation: 빈 문자열·"null" → null, 숫자 문자열 → number
    if ('ebookFile' in updateData) {
      const v = updateData.ebookFile
      if (v === '' || v === null || v === 'null' || v === undefined) {
        updateData.ebookFile = null
      } else {
        const n = Number(v)
        updateData.ebookFile = Number.isFinite(n) && n > 0 ? n : null
      }
    }

    const updated = await payload.update({ collection: 'products', id, data: updateData })
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    await payload.delete({ collection: 'products', id })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
