import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')

    if (id) {
      const program = await payload.findByID({ collection: 'programs', id, depth: 1 })
      return NextResponse.json(program)
    }
    if (slug) {
      const programs = await payload.find({
        collection: 'programs',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
      })
      return NextResponse.json(programs.docs[0] || null)
    }

    const programs = await payload.find({
      collection: 'programs',
      sort: '-updatedAt',
      limit: 100,
      depth: 1,
    })
    return NextResponse.json(programs)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const body: any = await req.json()
    const { title, slug, description, version, downloadUrl, platform, category, thumbnail, status, featured } = body

    const created = await payload.create({
      collection: 'programs',
      data: {
        title: title || 'Untitled',
        slug: slug || `program-${Date.now()}`,
        description,
        version,
        downloadUrl,
        platform: platform || 'all',
        category,
        thumbnail,
        status: status || 'draft',
        featured: featured || false,
      },
    })
    return NextResponse.json(created)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
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

    const updated = await payload.update({ collection: 'programs', id, data: updateData })
    return NextResponse.json(updated)
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

    await payload.delete({ collection: 'programs', id })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
