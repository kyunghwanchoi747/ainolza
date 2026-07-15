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
      overrideAccess: true,
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
      overrideAccess: true,
    })

    const now = new Date().toISOString()
    let result: any

    // 강의실 실제 회차 수 기준으로 진도율 계산 (강의실마다 회차 수가 다름)
    let classroomDoc: any = null
    try {
      classroomDoc = await payload.findByID({ collection: 'classrooms', id: classroomId, depth: 0 })
    } catch {
      // 강의실 조회 실패 시 기본값 20 사용
    }
    const sessions = classroomDoc?.sessions
    const totalSessions = Array.isArray(sessions) && sessions.length > 0 ? sessions.length : 20

    if (existing.docs.length > 0) {
      // 기존 기록 업데이트
      const doc = existing.docs[0] as any
      const completedSessions = Array.isArray(doc.completedSessions) ? [...doc.completedSessions] : []

      // 중복 확인
      const alreadyCompleted = completedSessions.some((s: any) => s.sessionNumber === sessionNumber)
      if (!alreadyCompleted) {
        completedSessions.push({ sessionNumber, completedAt: now })
      }

      const progressPercent = Math.min(100, Math.round((completedSessions.length / totalSessions) * 100))

      result = await payload.update({
        collection: 'classroom-progress',
        id: doc.id,
        data: {
          completedSessions,
          progressPercent,
          lastAccessedAt: now,
        },
        overrideAccess: true,
      })
    } else {
      // 새 기록 생성
      const progressPercent = Math.min(100, Math.round((1 / totalSessions) * 100))
      result = await payload.create({
        collection: 'classroom-progress',
        data: {
          user: (user as any).id,
          classroom: classroomId,
          completedSessions: [{ sessionNumber, completedAt: now }],
          progressPercent,
          lastAccessedAt: now,
        },
        overrideAccess: true,
      })
    }

    return Response.json(result)
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}
