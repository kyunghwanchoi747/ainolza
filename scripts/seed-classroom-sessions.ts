/**
 * 강의실 시드 스크립트 (idempotent)
 *
 * 두 종류를 다룬다:
 *   1) CLASSROOM_SEEDS: 강의실 row 자체 (없으면 create, 있으면 지정 필드만 갱신)
 *   2) SESSION_SEEDS:   특정 회차의 필드 (해당 필드가 비어있을 때만 채움)
 *
 * 둘 다 한 번 적용된 후엔 noop. 매니저 UI / admin 변경분은 보호됨.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

type ClassroomSeed = {
  slug: string
  /** 처음 생성될 때만 쓰는 기본값 */
  initial: {
    title: string
    shortTitle: string
    level: '입문' | '심화' | '특강'
    cohort?: number
    description?: string
    schedule?: string
    status?: 'active' | 'draft' | 'closed'
    order?: number
    sessions?: Array<{ week: number; title: string }>
  }
  /** 이미 존재할 때 강제 갱신할 필드 (특정 필드만 덮어씀). 비워두면 noop */
  forceUpdate?: Partial<{
    status: 'active' | 'draft' | 'closed'
    cohort: number
    title: string
    shortTitle: string
    schedule: string
  }>
}

type SessionSeed = {
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

// ─────────────────────────────────────────────────────────────
// SEEDS
// ─────────────────────────────────────────────────────────────

const CLASSROOM_SEEDS: ClassroomSeed[] = [
  // 1기 — 모집 종료 처리. row가 이미 있으면 status만 closed로 강제.
  {
    slug: 'vibe-coding-101',
    initial: {
      title: 'AI 바이브 코딩 [입문] — AI로 만드는 자동 수익 웹사이트 구축 실전',
      shortTitle: '바이브 코딩 입문 1기',
      level: '입문',
      cohort: 1,
      status: 'closed',
      order: 110,
    },
    forceUpdate: { status: 'closed', cohort: 1, shortTitle: '바이브 코딩 입문 1기' },
  },
  {
    slug: 'vibe-coding-advanced',
    initial: {
      title: 'AI 바이브 코딩 [심화] — 백지 위의 바이브코더 (심화 4주 과정)',
      shortTitle: '바이브 코딩 심화 1기',
      level: '심화',
      cohort: 1,
      status: 'closed',
      order: 120,
    },
    forceUpdate: { status: 'closed', cohort: 1, shortTitle: '바이브 코딩 심화 1기' },
  },

  // 2기 — 신규 강의실. row 없으면 빈 회차 4개로 생성. 이미 있으면 안 건드림.
  {
    slug: 'vibe-coding-101-2',
    initial: {
      title: 'AI 바이브 코딩 [입문] 2기 — AI로 만드는 자동 수익 웹사이트 구축 실전',
      shortTitle: '바이브 코딩 입문 2기',
      level: '입문',
      cohort: 2,
      description: 'AI 도구를 활용해 자동 수익 웹사이트를 만드는 입문 과정입니다.',
      status: 'draft',
      order: 210,
      sessions: [
        { week: 1, title: '입문 2기 1회차' },
        { week: 2, title: '입문 2기 2회차' },
      ],
    },
  },
  {
    slug: 'vibe-coding-advanced-2',
    initial: {
      title: 'AI 바이브 코딩 [심화] 2기 — 백지 위의 바이브코더 (심화 4주 과정)',
      shortTitle: '바이브 코딩 심화 2기',
      level: '심화',
      cohort: 2,
      description: '백지 상태에서 시작해 4주에 걸쳐 본격적으로 AI와 함께 코딩 능력을 키웁니다.',
      status: 'draft',
      order: 220,
      sessions: [
        { week: 1, title: '심화 2기 1회차' },
        { week: 2, title: '심화 2기 2회차' },
        { week: 3, title: '심화 2기 3회차' },
        { week: 4, title: '심화 2기 4회차' },
      ],
    },
  },
]

const SESSION_SEEDS: SessionSeed[] = [
  {
    classroomSlug: 'vibe-coding-advanced',
    week: 4,
    fields: {
      vimeoId: '1188615703',
      guidebookUrl:
        'https://www.notion.so/4-353c7863bde280ab9f94c50912345863?source=copy_link',
    },
  },
]

// ─────────────────────────────────────────────────────────────
// runners
// ─────────────────────────────────────────────────────────────

async function runClassroomSeeds(payload: any) {
  for (const seed of CLASSROOM_SEEDS) {
    const result = await payload.find({
      collection: 'classrooms' as any,
      where: { slug: { equals: seed.slug } },
      limit: 1,
      overrideAccess: true,
    })
    const existing = result.docs[0] as any

    if (!existing) {
      // 생성
      const data: Record<string, any> = {
        slug: seed.slug,
        title: seed.initial.title,
        shortTitle: seed.initial.shortTitle,
        level: seed.initial.level,
        cohort: seed.initial.cohort,
        description: seed.initial.description,
        schedule: seed.initial.schedule,
        status: seed.initial.status || 'draft',
        order: seed.initial.order,
        sessions: seed.initial.sessions,
      }
      await payload.create({
        collection: 'classrooms' as any,
        data,
        overrideAccess: true,
      })
      console.log(`[seed:classroom] created: ${seed.slug} (status=${data.status})`)
      continue
    }

    if (!seed.forceUpdate || Object.keys(seed.forceUpdate).length === 0) {
      console.log(`[seed:classroom] noop: ${seed.slug} (already exists, no forceUpdate)`)
      continue
    }

    // 강제 갱신 — 차이 있는 필드만 patch
    const patch: Record<string, any> = {}
    for (const [k, v] of Object.entries(seed.forceUpdate)) {
      if (v !== undefined && existing[k] !== v) patch[k] = v
    }
    if (Object.keys(patch).length === 0) {
      console.log(`[seed:classroom] noop: ${seed.slug} (forceUpdate values match)`)
      continue
    }
    await payload.update({
      collection: 'classrooms' as any,
      id: existing.id,
      data: patch,
      overrideAccess: true,
    })
    console.log(`[seed:classroom] updated: ${seed.slug} ← ${Object.keys(patch).join(', ')}`)
  }
}

async function runSessionSeeds(payload: any) {
  for (const seed of SESSION_SEEDS) {
    const result = await payload.find({
      collection: 'classrooms' as any,
      where: { slug: { equals: seed.classroomSlug } },
      limit: 1,
      overrideAccess: true,
    })
    const classroom = result.docs[0] as any
    if (!classroom) {
      console.log(`[seed:session] skip: classroom not found "${seed.classroomSlug}"`)
      continue
    }

    const sessions = Array.isArray(classroom.sessions) ? [...classroom.sessions] : []
    const idx = sessions.findIndex((s: any) => Number(s.week) === seed.week)
    if (idx < 0) {
      console.log(`[seed:session] skip: ${seed.classroomSlug} week ${seed.week} not found`)
      continue
    }

    const before = sessions[idx]
    const patch: Record<string, any> = {}
    for (const [k, v] of Object.entries(seed.fields)) {
      if (v && !before[k]) patch[k] = v
    }

    if (Object.keys(patch).length === 0) {
      console.log(
        `[seed:session] noop: ${seed.classroomSlug} week ${seed.week} (already filled)`,
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
      `[seed:session] applied: ${seed.classroomSlug} week ${seed.week} ← ${Object.keys(patch).join(', ')}`,
    )
  }
}

async function main() {
  const payload = await getPayload({ config })
  await runClassroomSeeds(payload)
  await runSessionSeeds(payload)
  process.exit(0)
}

main().catch((e) => {
  console.error('[seed] error:', e)
  process.exit(1)
})
