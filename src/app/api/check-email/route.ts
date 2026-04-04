import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json() as { email: string }

    if (!email) {
      return NextResponse.json({ error: '이메일을 입력해주세요.' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    return NextResponse.json({ exists: result.totalDocs > 0 })
  } catch {
    return NextResponse.json({ exists: false })
  }
}
