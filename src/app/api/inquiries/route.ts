import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const headersList = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { subject, message } = await req.json() as { subject?: string; message?: string }

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: '제목과 내용을 입력해 주세요.' }, { status: 400 })
    }

    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        subject: subject.trim(),
        message: message.trim(),
        user: user.id,
      },
    })

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (err) {
    console.error('[POST /api/inquiries]', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
