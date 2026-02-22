import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import config from '@/payload.config'

async function getAuth() {
  const headersList = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })
  return { payload, user }
}

// GET /api/manager/pages/[id] — fetch a single page
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = await payload.findByID({ collection: 'pages' as any, id })
    return NextResponse.json(page)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// PATCH /api/manager/pages/[id] — update puckData and/or status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as {
      puckData?: unknown; status?: string; title?: string; slug?: string
      seoTitle?: string; seoDescription?: string; seoKeywords?: string
    }
    const updateData: Record<string, unknown> = {}
    if (body.puckData !== undefined) updateData.puckData = body.puckData
    if (body.status !== undefined) updateData.status = body.status
    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.seoTitle !== undefined) updateData.seoTitle = body.seoTitle
    if (body.seoDescription !== undefined) updateData.seoDescription = body.seoDescription
    if (body.seoKeywords !== undefined) updateData.seoKeywords = body.seoKeywords

    const page = await payload.update({
      collection: 'pages' as any,
      id,
      data: updateData,
    })

    return NextResponse.json(page)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// DELETE /api/manager/pages/[id] — delete a page
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await payload.delete({ collection: 'pages' as any, id })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
