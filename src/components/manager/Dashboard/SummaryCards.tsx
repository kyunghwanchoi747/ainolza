import { CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'

interface CheckItem {
  label: string
  href: string
  done: boolean
}

interface SummaryCard {
  title: string
  items: CheckItem[]
}

const SUMMARY_DATA: SummaryCard[] = [
  {
    title: '기본설정',
    items: [
      { label: '사이트 정보 설정하기', href: '/manager/settings/seo', done: true },
      { label: '메뉴 설정하기', href: '/manager/settings/nav', done: true },
      { label: '결제 설정하기', href: '/manager/payment', done: true },
      { label: '도메인 연결하기', href: '/manager/settings/seo', done: true },
    ],
  },
  {
    title: '판매하기',
    items: [
      { label: '상품 추가하기', href: '/admin/collections/products/create', done: true },
      { label: '쇼핑 설정하기', href: '/manager/shopping/settings', done: true },
      { label: '주문 관리하기', href: '/manager/shopping/orders', done: false },
    ],
  },
  {
    title: '성장하기',
    items: [
      { label: '강의 등록하기', href: '/admin/collections/courses/create', done: true },
      { label: '프로그램 등록하기', href: '/admin/collections/programs/create', done: true },
      { label: '블로그 발행하기', href: '/admin/collections/posts/create', done: false },
      { label: '커뮤니티 관리하기', href: '/manager/content', done: false },
      { label: 'SEO 설정하기', href: '/manager/settings/seo', done: true },
      { label: '메시지 설정하기', href: '/manager/marketing/messages', done: false },
    ],
  },
  {
    title: '추천작업',
    items: [
      { label: '운영진 설정하기', href: '/admin/collections/users', done: false },
      { label: '자동입금확인 설정하기', href: '/manager/payment', done: false },
      { label: '채팅상담 설정하기', href: '/manager/marketing/messages', done: false },
    ],
  },
]

export function SummaryCards() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-700">📋 요약</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_DATA.map((card) => {
          const doneCount = card.items.filter((i) => i.done).length
          const total = card.items.length
          const pct = Math.round((doneCount / total) * 100)
          return (
            <div key={card.title} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">{card.title}</span>
                <span className="text-[10px] text-slate-400">{doneCount}/{total}개 완료</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <ul className="space-y-1">
                {card.items.map((item) => (
                  <li key={item.label} className="flex items-center gap-1.5">
                    {item.done ? (
                      <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                    ) : (
                      <Circle size={13} className="text-slate-300 shrink-0" />
                    )}
                    <Link
                      href={item.href}
                      className="text-[11px] text-slate-600 hover:text-blue-600 hover:underline truncate"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
