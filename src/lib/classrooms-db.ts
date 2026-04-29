/**
 * Classrooms DB 헬퍼
 * - Payload CMS의 classrooms 컬렉션에서 강의실 데이터를 가져온다
 * - 기존 src/lib/classrooms.ts와 같은 인터페이스를 제공해 페이지 코드 변경 최소화
 */
import { getPayloadClient } from './payload'

export type SessionDb = {
  week: number
  title: string
  vimeoId?: string
  youtubeLiveUrl?: string
  guidebookUrl?: string
  date?: string
  secret?: {
    password: string
    notionUrl: string
    label?: string
  }
}

export type ClassroomDb = {
  id: number
  slug: string
  title: string
  shortTitle: string
  description?: string
  level: '입문' | '심화' | '특강'
  cohort?: number
  liveUrl?: string
  resourceUrl?: string
  schedule?: string
  sessions?: SessionDb[]
  status?: 'active' | 'draft' | 'closed'
}

function mapDoc(doc: any): ClassroomDb {
  const sessions: SessionDb[] = Array.isArray(doc.sessions)
    ? doc.sessions.map((s: any) => ({
        week: s.week,
        title: s.title,
        vimeoId: s.vimeoId || undefined,
        youtubeLiveUrl: s.youtubeLiveUrl || undefined,
        guidebookUrl: s.guidebookUrl || undefined,
        date: s.date || undefined,
        secret: s.secretEnabled
          ? {
              password: s.secretPassword || '',
              notionUrl: s.secretNotionUrl || '',
              label: s.secretLabel || undefined,
            }
          : undefined,
      }))
    : []

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    shortTitle: doc.shortTitle || doc.title,
    description: doc.description || undefined,
    level: doc.level || '입문',
    cohort: doc.cohort || undefined,
    liveUrl: doc.liveUrl || undefined,
    resourceUrl: doc.resourceUrl || undefined,
    schedule: doc.schedule || undefined,
    sessions,
    status: doc.status || 'active',
  }
}

export async function getClassroomBySlug(slug: string): Promise<ClassroomDb | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'classrooms' as any,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const doc = result.docs[0]
    if (!doc) return null
    return mapDoc(doc)
  } catch {
    return null
  }
}

export async function listActiveClassrooms(): Promise<ClassroomDb[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'classrooms' as any,
      where: { status: { not_equals: 'draft' } },
      sort: 'order',
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })
    return (result.docs as any[]).map(mapDoc)
  } catch {
    return []
  }
}

/** 여러 slug에 해당하는 강의실 한 번에 조회 (마이페이지 등) */
export async function listClassroomsBySlugs(slugs: string[]): Promise<ClassroomDb[]> {
  if (!slugs.length) return []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'classrooms' as any,
      where: { slug: { in: slugs } },
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })
    return (result.docs as any[]).map(mapDoc)
  } catch {
    return []
  }
}
