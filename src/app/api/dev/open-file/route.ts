import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'dev only' }, { status: 403 })
  }

  const file = req.nextUrl.searchParams.get('file')
  const line = req.nextUrl.searchParams.get('line') || '1'

  if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 })

  const fullPath = file.startsWith('C:') || file.startsWith('/')
    ? file
    : path.join(process.cwd(), file)

  const target = `${fullPath}:${line}`
  return NextResponse.json({ ok: true, path: target })
}
