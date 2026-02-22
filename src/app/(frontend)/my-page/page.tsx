import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import {
  User,
  Package,
  FileText,
  MessageCircle,
  Settings,
  CreditCard,
  Bookmark,
  LogOut,
  CheckCircle,
  Clock,
  Truck,
} from 'lucide-react'
import Link from 'next/link'

const STATUS_MAP: Record<string, { label: string; color: string; Icon: any }> = {
  pending: { label: '결제대기', color: 'text-yellow-400 bg-yellow-400/10', Icon: Clock },
  paid: { label: '결제완료', color: 'text-emerald-400 bg-emerald-400/10', Icon: CheckCircle },
  preparing: { label: '배송준비', color: 'text-blue-400 bg-blue-400/10', Icon: Package },
  shipping: { label: '배송중', color: 'text-purple-400 bg-purple-400/10', Icon: Truck },
  delivered: { label: '배송완료', color: 'text-emerald-400 bg-emerald-400/10', Icon: CheckCircle },
  cancelled: { label: '취소됨', color: 'text-red-400 bg-red-400/10', Icon: Clock },
  returned: { label: '반품/교환', color: 'text-orange-400 bg-orange-400/10', Icon: Clock },
}

export default async function MyPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login')
  }

  const [ordersResult, postsResult, commentsResult] = await Promise.all([
    payload.find({
      collection: 'orders',
      where: { customer: { equals: user.id } },
      sort: '-createdAt',
      limit: 10,
      depth: 1,
    }),
    payload.find({
      collection: 'community-posts',
      where: { author: { equals: user.id } },
      limit: 0,
    }),
    payload.find({
      collection: 'comments',
      where: { user: { equals: user.id } },
      limit: 0,
    }),
  ])

  const orders = ordersResult.docs as any[]
  const u = user as any

  const stats = [
    { label: '구매 내역', icon: Package, value: String(ordersResult.totalDocs), color: 'text-blue-500' },
    { label: '작성한 글', icon: FileText, value: String(postsResult.totalDocs), color: 'text-purple-500' },
    { label: '작성한 댓글', icon: MessageCircle, value: String(commentsResult.totalDocs), color: 'text-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Profile Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl shadow-blue-500/20">
                <User className="h-14 w-14 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-black text-white tracking-tight">
                {u.nickname || '이름 미설정'}
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                {u.userType === 'vip' ? 'VIP MEMBER' : u.userType === 'admin' ? 'ADMIN' : 'MEMBER'}
              </p>
              {u.points > 0 && (
                <p className="mt-2 text-sm font-bold text-yellow-400">
                  {(u.points as number).toLocaleString()} P
                </p>
              )}
              {u.purchaseAmount > 0 && (
                <p className="mt-1 text-xs text-gray-600">
                  누적 구매: {(u.purchaseAmount as number).toLocaleString()}원
                </p>
              )}
              <div className="mt-8">
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95">
                  <Settings className="h-4 w-4" />
                  계정 설정
                </button>
              </div>
            </div>

            <nav className="rounded-[2.5rem] border border-white/10 bg-white/5 p-4 space-y-1">
              {[
                { label: '구매 내역', icon: CreditCard, href: '#orders' },
                { label: '수강 내역', icon: Bookmark, href: '#courses' },
                { label: '내 활동 관리', icon: FileText, href: '#activity' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-gray-400 transition-all hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <form action="/api/users/logout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-red-400 transition-all hover:bg-red-500/5"
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </button>
              </form>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-grow space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:border-blue-500/30 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-2xl bg-white/5 p-3 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-black text-white">{stat.value}</span>
                  </div>
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Orders */}
            <div id="orders" className="rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  최근 구매 내역
                </h3>
                <span className="text-xs font-bold text-gray-500">총 {ordersResult.totalDocs}건</span>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Package className="h-7 w-7 opacity-30" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest">구매 내역이 없습니다.</p>
                  <Link
                    href="/shop"
                    className="mt-4 text-xs font-bold text-blue-400 border border-blue-400/30 px-6 py-2 rounded-full hover:bg-blue-400/10"
                  >
                    스토어 보러가기
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => {
                    const statusInfo = STATUS_MAP[order.status] || STATUS_MAP['pending']
                    const { Icon } = statusInfo
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              주문 #{String(order.id).slice(-8).toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('ko-KR')} ·{' '}
                              {(order.amount ?? 0).toLocaleString()}원
                            </p>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusInfo.color}`}
                        >
                          <Icon className="h-3 w-3" />
                          {statusInfo.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
