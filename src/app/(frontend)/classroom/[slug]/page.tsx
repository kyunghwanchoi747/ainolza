import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getClassroom } from '@/lib/classrooms'

export const dynamic = 'force-dynamic'

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
          <h1 className="text-2xl font-bold text-[#333] mb-3">로그인이 필요합니다</h1>
          <p className="text-[#666] text-sm mb-8">
            <strong>{classroom.shortTitle}</strong> 강의실에 입장하려면 로그인이 필요합니다.
          </p>
          <Link
            href={`/login?redirect=/classroom/${slug}`}
            className="inline-block px-8 py-3 bg-[#D4756E] text-white font-bold rounded-xl hover:bg-[#c0625b] transition-colors"
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
          <h1 className="text-2xl font-bold text-[#333] mb-3">수강 신청이 필요합니다</h1>
          <p className="text-[#666] text-sm mb-2">
            <strong>{classroom.shortTitle}</strong> 강의실은 수강 신청한 분만 입장할 수 있습니다.
          </p>
          <p className="text-[#999] text-xs mb-8">
            다른 강의를 구매한 회원이라도 본 강의에는 별도로 신청해야 합니다.
          </p>
          <div className="space-y-3">
            <Link
              href="/store"
              className="inline-block w-full px-8 py-3 bg-[#D4756E] text-white font-bold rounded-xl hover:bg-[#c0625b] transition-colors"
            >
              수강 신청하기
            </Link>
            <Link
              href="/classroom"
              className="inline-block w-full px-8 py-3 border border-[#e5e5e5] text-[#666] font-medium rounded-xl hover:bg-[#f5f5f5] transition-colors"
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
          <Link href="/classroom" className="text-sm text-[#999] hover:text-[#D4756E]">
            ← 강의실 목록
          </Link>
          <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#FFF1F0] text-[#D4756E] mt-4 mb-3">
            {classroom.level}
          </div>
          <h1 className="text-3xl font-bold text-[#333]">{classroom.title}</h1>
          <p className="text-[#666] mt-3">{classroom.description}</p>
        </div>

        {classroom.schedule && (
          <section className="mb-8 p-6 bg-[#FFF8F7] rounded-2xl">
            <h2 className="text-lg font-bold text-[#333] mb-3">📅 강의 일정</h2>
            <p className="text-[#666] whitespace-pre-line">{classroom.schedule}</p>
          </section>
        )}

        {classroom.liveUrl && (
          <section className="mb-8 p-6 border border-[#D4756E] rounded-2xl bg-white">
            <h2 className="text-lg font-bold text-[#333] mb-3">🔴 실시간 라이브</h2>
            <p className="text-[#666] text-sm mb-4">아래 링크로 입장해 실시간 강의에 참여하세요.</p>
            <a
              href={classroom.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#D4756E] text-white font-bold rounded-xl hover:bg-[#c0625b] transition-colors"
            >
              유튜브 라이브 입장 →
            </a>
          </section>
        )}

        {classroom.resourceUrl && (
          <section className="mb-8 p-6 border border-[#e5e5e5] rounded-2xl">
            <h2 className="text-lg font-bold text-[#333] mb-3">📚 강의 자료</h2>
            <p className="text-[#666] text-sm mb-4">강의에 사용되는 자료는 노션 페이지에서 확인하실 수 있습니다.</p>
            <a
              href={classroom.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 border border-[#D4756E] text-[#D4756E] font-bold rounded-xl hover:bg-[#FFF1F0] transition-colors"
            >
              자료 페이지 열기 →
            </a>
          </section>
        )}

        {/* 회차별 영상 + 가이드북 */}
        {classroom.sessions && classroom.sessions.length > 0 && (
          <section className="space-y-12">
            <h2 className="text-2xl font-bold text-[#333]">회차별 강의</h2>
            {classroom.sessions.map((s) => (
              <div key={s.week} className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-medium text-[#D4756E]">{s.week}회차</span>
                  <h3 className="text-lg font-bold text-[#333]">{s.title}</h3>
                  {s.date && <span className="text-xs text-[#999]">{s.date}</span>}
                </div>

                {/* Vimeo 임베드 (16:9 반응형) */}
                <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={`https://player.vimeo.com/video/${s.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title={s.title}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {/* 가이드북 버튼 */}
                {s.guidebookUrl && (
                  <div className="flex justify-center pt-2">
                    <a
                      href={s.guidebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-[#1a1a1a] text-white font-bold rounded-full hover:bg-[#333] transition-colors text-sm"
                    >
                      {s.week}회차 가이드북
                    </a>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {!classroom.liveUrl &&
          !classroom.resourceUrl &&
          (!classroom.sessions || classroom.sessions.length === 0) && (
            <section className="p-6 border border-[#e5e5e5] rounded-2xl bg-[#fafafa] text-center">
              <p className="text-[#666]">강의 시작 전입니다. 일정이 확정되면 안내드립니다.</p>
            </section>
          )}
      </div>
    </div>
  )
}
