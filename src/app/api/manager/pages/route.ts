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

// GET /api/manager/pages — list all pages
export async function GET() {
  try {
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await payload.find({
      collection: 'pages' as any,
      limit: 200,
      sort: '-updatedAt',
    })

    return NextResponse.json({ docs: result.docs, totalDocs: result.totalDocs })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// POST /api/manager/pages — create a new page
export async function POST(req: NextRequest) {
  try {
    const { payload, user } = await getAuth()
    if (!user || (user as any).userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as { title?: string; slug?: string; puckData?: unknown }
    const { title, slug, puckData } = body

    if (!title || !slug) {
      return NextResponse.json({ error: 'title and slug are required' }, { status: 400 })
    }

    const page = await payload.create({
      collection: 'pages' as any,
      data: {
        title,
        slug,
        status: 'draft',
        puckData: puckData ?? { content: [], root: { props: {} } },
      },
    })

    return NextResponse.json(page)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
