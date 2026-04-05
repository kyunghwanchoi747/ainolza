'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Phone, LogOut, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: '주문접수', color: '#F59E0B' },
  paid: { label: '결제완료', color: '#10B981' },
  active: { label: '이용중', color: '#3B82F6' },
  completed: { label: '완료', color: '#6B7280' },
  refund_requested: { label: '환불요청', color: '#EF4444' },
  refunded: { label: '환불완료', color: '#9CA3AF' },
  failed: { label: '결제실패', color: '#EF4444' },
  cancelled: { label: '취소', color: '#9CA3AF' },
}

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showOrders, setShowOrders] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/users/me', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch('/api/payments', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
    ])
      .then(([userData, orderData]: any[]) => {
        if (userData?.user) {
          setUser(userData.user)
          setOrders(orderData?.orders || [])
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
    router.refresh()
  }

  const handleRefundRequest = async (orderId: string) => {
    const reason = prompt('환불 사유를 입력해주세요:')
    if (!reason) return

    try {
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId, reason }),
      })
      if (res.ok) {
        alert('환불 요청이 접수되었습니다.')
        window.location.reload()
      } else {
        alert('환불 요청에 실패했습니다.')
      }
    } catch {
      alert('오류가 발생했습니다.')
    }
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-[#999]">로딩 중...</p></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-3xl font-bold text-[#333] mb-8">마이페이지</h1>

          {/* 프로필 */}
          <div className="p-6 rounded-2xl bg-[#f8f8f8] border border-[#e5e5e5] mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#D4756E]/10 flex items-center justify-center">
                <User className="w-6 h-6 text-[#D4756E]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#333]">{user.name || '회원'}</h2>
                <p className="text-[#999] text-sm">{user.role === 'admin' ? '관리자' : '일반 회원'}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#999]" /><span className="text-[#666]">{user.email}</span></div>
              {user.phone && <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#999]" /><span className="text-[#666]">{user.phone}</span></div>}
            </div>
          </div>

          {/* 주문 내역 */}
          <div className="mb-6">
            <button
              onClick={() => setShowOrders(!showOrders)}
              className="w-full p-4 rounded-xl border border-[#e5e5e5] flex items-center justify-between hover:bg-[#f8f8f8] transition-all"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#D4756E]" />
                <div className="text-left">
                  <h3 className="font-medium text-[#333]">주문 내역</h3>
                  <p className="text-xs text-[#999]">{orders.length}건</p>
                </div>
              </div>
              {showOrders ? <ChevronUp className="w-5 h-5 text-[#999]" /> : <ChevronDown className="w-5 h-5 text-[#999]" />}
            </button>

            {showOrders && (
              <div className="mt-2 space-y-2">
                {orders.length === 0 ? (
                  <p className="p-4 text-center text-sm text-[#999]">주문 내역이 없습니다.</p>
                ) : (
                  orders.map((order: any) => {
                    const st = statusLabels[order.status] || statusLabels.pending
                    return (
                      <div key={order.id} className="p-4 rounded-xl border border-[#e5e5e5]">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-[#333] text-sm">{order.productName}</p>
                            <p className="text-xs text-[#999]">{order.orderNumber}</p>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.color + '20', color: st.color }}>
                            {st.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#333]">{order.amount?.toLocaleString()}원</span>
                          <div className="flex gap-2">
                            {order.receiptUrl && (
                              <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#999] hover:text-[#333] underline">영수증</a>
                            )}
                            {(order.status === 'paid' || order.status === 'active') && (
                              <button onClick={() => handleRefundRequest(order.id)} className="text-xs text-red-400 hover:text-red-600 underline">환불 신청</button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-[#999] mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('ko-KR') : ''}</p>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {/* 메뉴 */}
          <div className="space-y-2">
            <Link href="/store" className="block p-4 rounded-xl border border-[#e5e5e5] hover:border-[#D4756E]/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#333]">강의/전자책</h3>
                  <p className="text-xs text-[#999]">구매 가능한 콘텐츠 보기</p>
                </div>
                <span className="text-[#999]">&rarr;</span>
              </div>
            </Link>

            <Link href="/labs" className="block p-4 rounded-xl border border-[#e5e5e5] hover:border-[#D4756E]/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#333]">AI 실험실</h3>
                  <p className="text-xs text-[#999]">무료 AI 체험 프로그램</p>
                </div>
                <span className="text-[#999]">&rarr;</span>
              </div>
            </Link>

            {user.role === 'admin' && (
              <Link href="/manager" className="block p-4 rounded-xl border border-[#D4756E]/20 bg-[#D4756E]/5 hover:bg-[#D4756E]/10 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#D4756E]">관리자 대시보드</h3>
                    <p className="text-xs text-[#D4756E]/60">사이트 관리 페이지</p>
                  </div>
                  <span className="text-[#D4756E]">&rarr;</span>
                </div>
              </Link>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-8 py-3 border border-[#e5e5e5] rounded-xl text-[#999] hover:text-[#333] hover:border-[#333] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" /> 로그아웃
          </button>
        </div>
      </section>
    </div>
  )
}
