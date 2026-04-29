import Link from 'next/link'
import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { listActiveClassrooms } from '@/lib/classrooms-db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '강의실 | AI놀자',
  description: 'AI놀자의 강의실 목록입니다. 수강 신청한 강의의 진행 공간으로 이동할 수 있습니다.',
}

async function getOwnedSlugs(): Promise<Set<string>> {
  try {
    const payload = await getPayloadClient()
    const hdrs = await headers()
    const { user } = await payload.auth({ headers: hdrs as unknown as Headers })
    if (!user) return new Set()

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

    const slugs = new Set<string>()
    for (const o of orders.docs as any[]) {
      const arr = o.classrooms
      if (Array.isArray(arr)) {
        for (const s of arr) slugs.add(String(s))
      }
    }
    return slugs
  } catch {
    return new Set()
  }
}

export default async function ClassroomListPage() {
  const [owned, classrooms] = await Promise.all([
    getOwnedSlugs(),
    listActiveClassrooms(),
  ])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-ink">강의실</h1>
          <p className="text-body mt-3">
            수강 신청한 강의는 입장하기 버튼이 활성화됩니다. 처음 방문하셨다면{' '}
            <Link href="/store" className="text-brand hover:underline">
              스토어
            </Link>
            에서 강의를 구매할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {classrooms.map((c) => {
            const isOwned = owned.has(c.slug)
            return (
              <div
                key={c.slug}
                className="border border-line rounded-2xl p-6 bg-white hover:shadow-md transition-shadow"
              >
                <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-brand-light text-brand mb-3">
                  {c.level}
                </div>
                <h2 className="text-xl font-bold text-ink mb-2">{c.shortTitle}</h2>
                <p className="text-body text-sm mb-6 leading-relaxed">{c.description}</p>

                {isOwned ? (
                  <Link
                    href={`/classroom/${c.slug}`}
                    className="inline-block w-full text-center py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors"
                  >
                    강의실 입장
                  </Link>
                ) : (
                  <Link
                    href="/store"
                    className="inline-block w-full text-center py-3 bg-[#f5f5f5] text-sub font-bold rounded-xl hover:bg-[#eee] transition-colors"
                  >
                    수강 신청하기
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
