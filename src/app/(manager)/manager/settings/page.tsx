import Link from 'next/link'
import { PageHeader } from '@/components/manager/PageHeader'
import { Search, Menu, Home, ExternalLink } from 'lucide-react'

const SETTING_LINKS = [
  { icon: Home, label: '홈 화면 설정', description: 'Hero 섹션, 버튼, 배경 이미지 설정', href: '/admin/globals/hero', external: true },
  { icon: Menu, label: '메뉴 설정', description: '상단 네비게이션 메뉴 편집', href: '/manager/settings/nav', external: false },
  { icon: Search, label: 'SEO 설정', description: '검색엔진 최적화 및 메타 정보', href: '/manager/settings/seo', external: false },
]

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="설정" description="사이트 기본 설정을 관리합니다." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SETTING_LINKS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <item.icon size={18} className="text-blue-600" />
              </div>
              {item.external && <ExternalLink size={13} className="text-slate-300 group-hover:text-blue-400" />}
            </div>
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
