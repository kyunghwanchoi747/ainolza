import Link from 'next/link'
import { PageHeader } from '@/components/manager/PageHeader'
import { ExternalLink } from 'lucide-react'
export default function MessagesPage() {
  return (
    <div>
      <PageHeader title="메시지 설정" description="카카오 알림톡 및 메시지 템플릿을 관리합니다." />
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-600 mb-4 text-sm">메시지 설정은 Payload Admin에서 관리합니다.</p>
        <Link href="/admin/globals/message-settings" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          메시지 설정 열기 <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  )
}
