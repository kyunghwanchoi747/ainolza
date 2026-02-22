import { PageHeader } from '@/components/manager/PageHeader'
export default function ExtensionsPage() {
  return (
    <div>
      <PageHeader title="확장" />
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-2xl mb-2">🔌</p>
        <p className="text-slate-600 font-medium">준비 중입니다</p>
        <p className="text-sm text-slate-400 mt-1">외부 연동, 앱, 매출 도구 기능이 곧 추가될 예정입니다.</p>
      </div>
    </div>
  )
}
