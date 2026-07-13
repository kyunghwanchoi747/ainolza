import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const hdrs = await headers()
    const { user } = await payload.auth({ headers: hdrs as unknown as Headers })

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await payload.find({
      collection: 'classroom-progress',
      where: { user: { equals: (user as any).id } },
      limit: 100,
      depth: 1,
    })

    return Response.json({ progress: progress.docs })
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const hdrs = await headers()
    const { user } = await payload.auth({ headers: hdrs as unknown as Headers })

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { classroomId, sessionNumber } = await req.json() as { classroomId: number; sessionNumber: number }

    if (!classroomId || !sessionNumber) {
      return Response.json({ error: 'Missing classroomId or sessionNumber' }, { status: 400 })
    }

    // 해당 classroom에 대한 progress 기록 찾기
    const existing = await payload.find({
      collection: 'classroom-progress',
      where: {
        and: [
          { user: { equals: (user as any).id } },
          { classroom: { equals: classroomId } },
        ],
      },
      limit: 1,
      depth: 0,
    })

    const now = new Date().toISOString()
    let result: any

    if (existing.docs.length > 0) {
      // 기존 기록 업데이트
      const doc = existing.docs[0] as any
      const completedSessions = Array.isArray(doc.completedSessions) ? [...doc.completedSessions] : []

      // 중복 확인
      const alreadyCompleted = completedSessions.some((s: any) => s.sessionNumber === sessionNumber)
      if (!alreadyCompleted) {
        completedSessions.push({ sessionNumber, completedAt: now })
      }

      // progressPercent 계산 (20회차 기준)
      const progressPercent = Math.round((completedSessions.length / 20) * 100)

      result = await payload.update({
        collection: 'classroom-progress',
        id: doc.id,
        data: {
          completedSessions,
          progressPercent,
          lastAccessedAt: now,
        },
      })
    } else {
      // 새 기록 생성
      const progressPercent = Math.round((1 / 20) * 100)
      result = await payload.create({
        collection: 'classroom-progress',
        data: {
          user: (user as any).id,
          classroom: classroomId,
          completedSessions: [{ sessionNumber, completedAt: now }],
          progressPercent,
          lastAccessedAt: now,
        },
      })
    }

    return Response.json(result)
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}
