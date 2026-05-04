import Link from 'next/link'
import { GraduationCap, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPayloadClient } from '@/lib/payload'
import { ClassroomCloneButton } from '@/components/manager/classroom-clone-button'

export const dynamic = 'force-dynamic'

type ClassroomRow = {
  id: number
  slug: string
  title: string
  shortTitle: string
  level: string
  cohort?: number
  status: string
  sessionsCount: number
  filledSessionsCount: number
}

export default async function ManagerClassroomsPage() {
  let classrooms: ClassroomRow[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'classrooms' as any,
      sort: 'order',
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })

    classrooms = (result.docs as any[]).map((doc) => {
      const sessions = Array.isArray(doc.sessions) ? doc.sessions : []
      const filled = sessions.filter((s: any) => s.vimeoId || s.youtubeLiveUrl || s.guidebookUrl).length
      return {
        id: doc.id,
        slug: doc.slug,
        title: doc.title || '',
        shortTitle: doc.shortTitle || doc.title || '',
        level: doc.level || '입문',
        cohort: doc.cohort || undefined,
        status: doc.status || 'active',
        sessionsCount: sessions.length,
        filledSessionsCount: filled,
      }
    })
  } catch {
    // classrooms collection may not exist yet
  }

  const statusBadge = (status: string) => {
    if (status === 'active') return <Badge variant="success">운영중</Badge>
    if (status === 'draft') return <Badge variant="warning">준비중</Badge>
    return <Badge variant="secondary">종료</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">강의실 관리</h1>
        <p className="text-muted-foreground mt-1">
          회차별 강의 영상(Vimeo)과 가이드북(노션) 링크를 등록·수정합니다.
        </p>
      </div>

      {classrooms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            등록된 강의실이 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {classrooms.map((c) => (
            <Card key={c.id} className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{c.shortTitle}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 truncate">
                      {c.slug} {c.cohort ? `· ${c.cohort}기` : ''}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline">{c.level}</Badge>
                    {statusBadge(c.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-muted-foreground min-w-0">
                    회차 {c.sessionsCount}개{' '}
                    {c.sessionsCount > 0 && (
                      <span className="text-xs">
                        (영상/자료 등록 {c.filledSessionsCount}/{c.sessionsCount})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ClassroomCloneButton
                      sourceId={c.id}
                      sourceSlug={c.slug}
                      sourceShortTitle={c.shortTitle}
                      sourceCohort={c.cohort}
                    />
                    <Link
                      href={`/manager/classrooms/${c.id}/edit`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      회차 관리
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
