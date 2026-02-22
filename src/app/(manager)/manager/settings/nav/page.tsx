import Link from 'next/link'
import { PageHeader } from '@/components/manager/PageHeader'
import { ExternalLink } from 'lucide-react'

export default function NavSettingsPage() {
  return (
    <div>
      <PageHeader title="메뉴 설정" description="홈페이지 상단 네비게이션 메뉴를 관리합니다." />
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-600 mb-4 text-sm">메뉴 설정은 Payload Admin에서 관리합니다.</p>
        <Link
          href="/admin/globals/main-nav"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          메뉴 설정 열기 <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  )
}
