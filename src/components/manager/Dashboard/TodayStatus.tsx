import Link from 'next/link'

interface TodayStatusProps {
  summary: {
    pendingOrders: number
    cancelledOrders: number
    pendingInquiries: number
    totalCourses: number
    totalPrograms: number
  }
}

export function TodayStatus({ summary }: TodayStatusProps) {
  const items = [
    { label: '신규주문', value: summary.pendingOrders, href: '/manager/shopping/orders?status=pending', color: 'text-blue-600' },
    { label: '취소관리', value: summary.cancelledOrders, href: '/manager/shopping/orders?status=cancelled', color: 'text-red-500' },
    { label: '반품관리', value: 0, href: '/manager/shopping/orders?status=returned', color: 'text-orange-500' },
    { label: '교환관리', value: 0, href: '/manager/shopping/orders', color: 'text-yellow-500' },
    { label: '답변대기 문의', value: summary.pendingInquiries, href: '/manager/shopping/inquiries?status=pending', color: 'text-purple-600' },
  ]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
      <h2 className="text-sm font-bold text-slate-700 mb-3">📌 오늘의 할일</h2>
      <div className="flex items-center gap-6 overflow-x-auto pb-1">
        {items.map((item, idx) => (
          <div key={item.label} className="flex items-center gap-6">
            <Link href={item.href} className="flex flex-col items-center min-w-[60px] group">
              <span className={`text-2xl font-bold ${item.color} group-hover:underline`}>
                {item.value}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 whitespace-nowrap">{item.label}</span>
            </Link>
            {idx < items.length - 1 && <div className="h-8 w-px bg-slate-100" />}
          </div>
        ))}
      </div>
    </div>
  )
}
