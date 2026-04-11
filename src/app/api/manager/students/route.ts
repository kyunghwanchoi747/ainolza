import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const payload = await getPayloadClient()

    // D1 SQL: 모든 일반 사용자 + 주문 건수
    const result = await (payload as any).db.findOne({
      collection: 'users',
      where: { role: { equals: 'user' } },
      limit: 10000, // 충분한 한도
    })

    // Payload 쿼리 방식
    const users = await payload.find({
      collection: 'users',
      where: { role: { equals: 'user' } },
      limit: 10000,
    })

    // 각 사용자의 주문 수 계산
    const students = await Promise.all(
      (users.docs || []).map(async (user: any) => {
        const orders = await payload.find({
          collection: 'orders',
          where: { user: { equals: user.id } },
          limit: 1,
          depth: 0,
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          orderCount: orders.totalDocs,
        }
      }),
    )

    // 최신 가입순으로 정렬
    students.sort((a, b) => b.id - a.id)

    return NextResponse.json({ students })
  } catch (err) {
    console.error('[STUDENTS] error:', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
