import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PageHeader } from '@/components/manager/PageHeader'
import { FileText, BookOpen, Package, MessageSquare, ExternalLink, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let counts = { posts: 0, courses: 0, programs: 0, communityPosts: 0 }
  try {
    const [posts, courses, programs, community] = await Promise.all([
      payload.count({ collection: 'posts' }),
      payload.count({ collection: 'courses' }),
      payload.count({ collection: 'programs' }),
      payload.count({ collection: 'community-posts' }),
    ])
    counts = {
      posts: posts.totalDocs,
      courses: courses.totalDocs,
      programs: programs.totalDocs,
      communityPosts: community.totalDocs,
    }
  } catch {}

  const sections = [
    { icon: FileText, label: '블로그/칼럼', count: counts.posts, color: 'text-blue-600 bg-blue-50', editHref: '/admin/collections/posts', createHref: '/admin/collections/posts/create' },
    { icon: BookOpen, label: '강의/코스', count: counts.courses, color: 'text-purple-600 bg-purple-50', editHref: '/admin/collections/courses', createHref: '/admin/collections/courses/create' },
    { icon: Package, label: '프로그램', count: counts.programs, color: 'text-green-600 bg-green-50', editHref: '/admin/collections/programs', createHref: '/admin/collections/programs/create' },
    { icon: MessageSquare, label: '커뮤니티', count: counts.communityPosts, color: 'text-orange-600 bg-orange-50', editHref: '/admin/collections/community-posts', createHref: '/admin/collections/community-posts/create' },
  ]

  return (
    <div>
      <PageHeader title="콘텐츠" description="블로그, 강의, 프로그램, 커뮤니티를 관리합니다." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{s.label}</p>
                  <p className="text-xs text-slate-400">총 {s.count}개</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={s.editHref}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ExternalLink size={12} /> 목록 보기
              </Link>
              <Link
                href={s.createHref}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus size={12} /> 새로 작성
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
