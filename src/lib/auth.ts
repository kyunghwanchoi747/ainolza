import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from './payload'

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  try {
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: '인증이 만료되었습니다.' }, { status: 401 })
    }

    if ((user as any).role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 })
    }

    return null // 인증 통과
  } catch {
    return NextResponse.json({ error: '인증 오류가 발생했습니다.' }, { status: 401 })
  }
}
