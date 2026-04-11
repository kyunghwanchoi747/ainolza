import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getClassroom } from '@/lib/classrooms'
import { SecretUnlock } from '@/components/classroom/secret-unlock'

export const dynamic = 'force-dynamic'

/**
 * YouTube URL에서 video ID 추출 (다양한 형식 지원)
 *  - https://www.youtube.com/watch?v=XXXX
 *  - https://youtu.be/XXXX
 *  - https://www.youtube.com/live/XXXX
 *  - https://www.youtube.com/embed/XXXX
 *  - XXXX (ID만)
 */
function extractYouTubeId(input: string): string | null {
  if (!input) return null
  const trimmed = input.trim()
  // ID만 (11자 영숫자/_/-)
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    // youtu.be/XXXX
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.slice(1).split('/')[0]
      return id || null
    }
    // youtube.com/watch?v=XXXX
    const v = url.searchParams.get('v')
    if (v) return v
    // youtube.com/live/XXXX 또는 youtube.com/embed/XXXX
    const m = url.pathname.match(/\/(?:live|embed|v)\/([A-Za-z0-9_-]{11})/)
    if (m) return m[1]
  } catch {
    // 무시
  }
  return null
}

type AccessResult =
  | { state: 'unauthenticated' }
  | { state: 'denied'; user: any }
  | { state: 'allowed'; user: any }

async function checkAccess(slug: string): Promise<AccessResult> {
  try {
    const payload = await getPayloadClient()
    const hdrs = await headers()
    const { user } = await payload.auth({ headers: hdrs as unknown as Headers })

    if (!user) return { state: 'unauthenticated' }

    const orders = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { user: { equals: (user as any).id } },
          { status: { in: ['paid', 'active', 'completed'] } },
        ],
      },
      limit: 200,
      depth: 0,
    })

    let hasAccess = false
    for (const o of orders.docs as any[]) {
      const arr = o.classrooms
      if (Array.isArray(arr) && arr.includes(slug)) {
        hasAccess = true
        break
      }
    }

    return hasAccess ? { state: 'allowed', user } : { state: 'denied', user }
  } catch {
    return { state: 'unauthenticated' }
  }
}

export default async function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const classroom = getClassroom(slug)
  if (!classroom) return notFound()

  const access = await checkAccess(slug)

  // 미로그인
  if (access.state === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-ink mb-3">로그인이 필요합니다</h1>
          <p className="text-body text-sm mb-8">
            <strong>{classroom.shortTitle}</strong> 강의실에 입장하려면 로그인이 필요합니다.
          </p>
          <Link
            href={`/login?redirect=/classroom/${slug}`}
            className="inline-block px-8 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors"
          >
            로그인하기
          </Link>
        </div>
      </div>
    )
  }

  // 로그인은 했지만 수강 안 함
  if (access.state === 'denied') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">🎫</div>
          <h1 className="text-2xl font-bold text-ink mb-3">수강 신청이 필요합니다</h1>
          <p className="text-body text-sm mb-2">
            <strong>{classroom.shortTitle}</strong> 강의실은 수강 신청한 분만 입장할 수 있습니다.
          </p>
          <p className="text-sub text-xs mb-8">
            다른 강의를 구매한 회원이라도 본 강의에는 별도로 신청해야 합니다.
          </p>
          <div className="space-y-3">
            <Link
              href="/store"
              className="inline-block w-full px-8 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors"
            >
              수강 신청하기
            </Link>
            <Link
              href="/classroom"
              className="inline-block w-full px-8 py-3 border border-line text-body font-medium rounded-xl hover:bg-[#f5f5f5] transition-colors"
            >
              강의실 목록으로
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 정상 입장
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/classroom" className="text-sm text-sub hover:text-brand">
            ← 강의실 목록
          </Link>
          <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-brand-light text-brand mt-4 mb-3">
            {classroom.level}
          </div>
          <h1 className="text-3xl font-bold text-ink">{classroom.title}</h1>
          <p className="text-body mt-3">{classroom.description}</p>
        </div>

        {classroom.schedule && (
          <section className="mb-8 p-6 bg-brand-light rounded-2xl">
            <h2 className="text-lg font-bold text-ink mb-3">📅 강의 일정</h2>
            <p className="text-body whitespace-pre-line">{classroom.schedule}</p>
          </section>
        )}

        {classroom.liveUrl && (
          <section className="mb-8 p-6 border border-[#D4756E] rounded-2xl bg-white">
            <h2 className="text-lg font-bold text-ink mb-3">🔴 실시간 라이브</h2>
            <p className="text-body text-sm mb-4">아래 링크로 입장해 실시간 강의에 참여하세요.</p>
            <a
              href={classroom.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors"
            >
              유튜브 라이브 입장 →
            </a>
          </section>
        )}

        {classroom.resourceUrl && (
          <section className="mb-8 p-6 border border-line rounded-2xl">
            <h2 className="text-lg font-bold text-ink mb-3">📚 강의 자료</h2>
            <p className="text-body text-sm mb-4">강의에 사용되는 자료는 노션 페이지에서 확인하실 수 있습니다.</p>
            <a
              href={classroom.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 border border-[#D4756E] text-brand font-bold rounded-xl hover:bg-brand-light transition-colors"
            >
              자료 페이지 열기 →
            </a>
          </section>
        )}

        {/* 회차별 영상 + 가이드북 */}
        {classroom.sessions && classroom.sessions.length > 0 && (
          <section className="space-y-12">
            <h2 className="text-2xl font-bold text-ink">회차별 강의</h2>
            {classroom.sessions.map((s) => {
              // 우선순위: vimeoId(녹화본) > youtubeLiveUrl(라이브)
              const isVod = !!s.vimeoId
              const ytId = !isVod && s.youtubeLiveUrl ? extractYouTubeId(s.youtubeLiveUrl) : null
              const isLive = !isVod && !!ytId
              const hasVideo = isVod || isLive
              return (
                <div key={s.week} className="space-y-4">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-sm font-medium text-brand">{s.week}회차</span>
                    <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                    {s.date && <span className="text-xs text-sub">{s.date}</span>}
                    {isLive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* 영상 임베드 (16:9 반응형) */}
                  {hasVideo ? (
                    <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ paddingTop: '56.25%' }}>
                      {isVod ? (
                        <iframe
                          src={`https://player.vimeo.com/video/${s.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          title={s.title}
                          className="absolute inset-0 w-full h-full"
                        />
                      ) : (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          title={s.title}
                          className="absolute inset-0 w-full h-full"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
                      <p className="text-sub text-sm">강의 시작 전입니다. 일정이 확정되면 안내드립니다.</p>
                    </div>
                  )}

                  {/* 가이드북 버튼 */}
                  {s.guidebookUrl && (
                    <div className="flex justify-center pt-2">
                      <a
                        href={s.guidebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-dark text-white font-bold rounded-full hover:bg-ink transition-colors text-sm"
                      >
                        {s.week}회차 가이드북
                      </a>
                    </div>
                  )}

                  {/* 비밀 공간 */}
                  {s.secret && (
                    <SecretUnlock
                      password={s.secret.password}
                      notionUrl={s.secret.notionUrl}
                      label={s.secret.label}
                    />
                  )}
                </div>
              )
            })}
          </section>
        )}

        {!classroom.liveUrl &&
          !classroom.resourceUrl &&
          (!classroom.sessions || classroom.sessions.length === 0) && (
            <section className="p-6 border border-line rounded-2xl bg-surface text-center">
              <p className="text-body">강의 시작 전입니다. 일정이 확정되면 안내드립니다.</p>
            </section>
          )}
      </div>
    </div>
  )
}
