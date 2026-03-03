import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')

    if (id) {
      const page = await payload.findByID({ collection: 'design-pages', id })
      return NextResponse.json(page)
    }

    if (slug) {
      const pages = await payload.find({
        collection: 'design-pages',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      return NextResponse.json(pages.docs[0] || null)
    }

    const pages = await payload.find({
      collection: 'design-pages',
      sort: '-updatedAt',
      limit: 100,
    })
    return NextResponse.json(pages)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const body: any = await req.json()
    const { title, slug, projectData, html, css, status } = body

    const created = await payload.create({
      collection: 'design-pages',
      data: {
        title: title || 'Untitled',
        slug: slug || `page-${Date.now()}`,
        projectData,
        html,
        css,
        status: status || 'draft',
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
    const { id, projectData, html, css, title, slug, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    if (projectData !== undefined) updateData.projectData = projectData
    if (html !== undefined) updateData.html = html
    if (css !== undefined) updateData.css = css
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (status !== undefined) updateData.status = status

    const updated = await payload.update({
      collection: 'design-pages',
      id,
      data: updateData,
    })

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

    await payload.delete({
      collection: 'design-pages',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
