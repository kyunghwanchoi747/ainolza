import { cn } from '@/lib/manager/cn'

const statusMap: Record<string, { label: string; className: string }> = {
  // Orders
  pending: { label: '대기', className: 'bg-yellow-100 text-yellow-700' },
  paid: { label: '결제완료', className: 'bg-blue-100 text-blue-700' },
  preparing: { label: '준비중', className: 'bg-indigo-100 text-indigo-700' },
  shipping: { label: '배송중', className: 'bg-purple-100 text-purple-700' },
  delivered: { label: '배송완료', className: 'bg-green-100 text-green-700' },
  cancelled: { label: '취소', className: 'bg-red-100 text-red-700' },
  returned: { label: '반품', className: 'bg-orange-100 text-orange-700' },
  // Products
  published: { label: '판매중', className: 'bg-green-100 text-green-700' },
  sold_out: { label: '품절', className: 'bg-orange-100 text-orange-700' },
  hidden: { label: '숨김', className: 'bg-slate-100 text-slate-500' },
  draft: { label: '임시저장', className: 'bg-slate-100 text-slate-600' },
  // Inquiries
  answered: { label: '답변완료', className: 'bg-green-100 text-green-700' },
  // User types
  admin: { label: '관리자', className: 'bg-red-100 text-red-700' },
  vip: { label: 'VIP', className: 'bg-yellow-100 text-yellow-700' },
  general: { label: '일반', className: 'bg-slate-100 text-slate-600' },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status] ?? { label: status, className: 'bg-slate-100 text-slate-600' }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
