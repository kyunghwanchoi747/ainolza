/**
 * 강의실 회차 시드 스크립트 (idempotent)
 *
 * 배포 파이프라인에서 매 빌드마다 실행되지만,
 * SEEDS 배열의 각 항목은 "해당 필드가 비어있을 때만" 채워넣음.
 * → 한 번 채워진 후엔 noop. 매니저 UI나 admin에서 변경한 값은 보호됨.
 *
 * 새 회차 데이터 시드가 필요하면 SEEDS에 항목만 추가 → push.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

type Seed = {
  classroomSlug: string
  week: number
  /** 비어있을 때만 채워넣을 필드들 */
  fields: Partial<{
    title: string
    date: string
    vimeoId: string
    youtubeLiveUrl: string
    guidebookUrl: string
  }>
}

const SEEDS: Seed[] = [
  {
    classroomSlug: 'vibe-coding-advanced',
    week: 4,
    fields: {
      guidebookUrl:
        'https://www.notion.so/4-353c7863bde280ab9f94c50912345863?source=copy_link',
    },
  },
]

async function main() {
  const payload = await getPayload({ config })

  for (const seed of SEEDS) {
    const result = await payload.find({
      collection: 'classrooms' as any,
      where: { slug: { equals: seed.classroomSlug } },
      limit: 1,
      overrideAccess: true,
    })
    const classroom = result.docs[0] as any
    if (!classroom) {
      console.log(`[seed] skip: classroom not found "${seed.classroomSlug}"`)
      continue
    }

    const sessions = Array.isArray(classroom.sessions) ? [...classroom.sessions] : []
    const idx = sessions.findIndex((s: any) => Number(s.week) === seed.week)
    if (idx < 0) {
      console.log(`[seed] skip: ${seed.classroomSlug} week ${seed.week} not found`)
      continue
    }

    const before = sessions[idx]
    const patch: Record<string, any> = {}
    for (const [k, v] of Object.entries(seed.fields)) {
      if (v && !before[k]) patch[k] = v
    }

    if (Object.keys(patch).length === 0) {
      console.log(
        `[seed] noop: ${seed.classroomSlug} week ${seed.week} (already filled)`,
      )
      continue
    }

    sessions[idx] = { ...before, ...patch }
    await payload.update({
      collection: 'classrooms' as any,
      id: classroom.id,
      data: { sessions } as any,
      overrideAccess: true,
    })
    console.log(
      `[seed] applied: ${seed.classroomSlug} week ${seed.week} ← ${Object.keys(patch).join(', ')}`,
    )
  }

  process.exit(0)
}

main().catch((e) => {
  console.error('[seed] error:', e)
  process.exit(1)
})
