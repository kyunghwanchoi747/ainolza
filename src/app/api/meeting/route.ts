import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { requireAdmin } from '@/lib/auth'

async function getD1() {
  const { env } = await getCloudflareContext({ async: true })
  return (env as any).D1 as D1Database
}

// 현재 활성 회의실 조회 (누구나 가능)
export async function GET() {
  try {
    const db = await getD1()
    const result = await db
      .prepare('SELECT id, room_name, title, password IS NOT NULL AS has_password, created_at FROM meetings WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1')
      .all()
    const meeting = result.results[0] || null
    return NextResponse.json({ meeting })
  } catch (err) {
    console.error('[MEETING GET]', (err as Error).message)
    return NextResponse.json({ meeting: null })
  }
}

// 회의실 개설 (관리자만)
export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const body = await request.json() as { title?: string; password?: string }
    const { title, password } = body
    if (!title) return NextResponse.json({ error: '회의 제목을 입력해주세요.' }, { status: 400 })

    const roomName = `ainolza-${Date.now()}`
    const db = await getD1()

    // 기존 활성 회의 종료
    await db.prepare('UPDATE meetings SET is_active = 0, ended_at = datetime(\'now\') WHERE is_active = 1').run()

    // 새 회의 개설
    await db
      .prepare('INSERT INTO meetings (room_name, title, password, is_active) VALUES (?, ?, ?, 1)')
      .bind(roomName, title, password || null)
      .run()

    return NextResponse.json({ ok: true, roomName })
  } catch (err) {
    console.error('[MEETING POST]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

// 회의실 종료 (관리자만)
export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const db = await getD1()
    await db.prepare('UPDATE meetings SET is_active = 0, ended_at = datetime(\'now\') WHERE is_active = 1').run()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[MEETING DELETE]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
