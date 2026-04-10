'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Phone, LogOut, ShoppingBag, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react'
import { CLASSROOMS } from '@/lib/classrooms'

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

  const handleDeleteAccount = async () => {
    if (!user?.id) return
    const confirmed = confirm(
      '정말로 회원탈퇴 하시겠습니까?\n\n' +
      '- 회원 정보가 영구 삭제됩니다.\n' +
      '- 구매한 강의/책 액세스 권한도 함께 사라집니다.\n' +
      '- 이 작업은 되돌릴 수 없습니다.',
    )
    if (!confirmed) return
    const second = prompt("탈퇴를 확정하려면 '탈퇴' 두 글자를 입력해주세요.")
    if (second !== '탈퇴') return

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        alert('회원탈퇴가 완료되었습니다.')
        await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
        router.push('/')
        router.refresh()
      } else {
        const data = (await res.json().catch(() => ({}))) as { errors?: Array<{ message?: string }> }
        alert(`탈퇴 실패: ${data?.errors?.[0]?.message || '알 수 없는 오류'}`)
      }
    } catch (e) {
      alert(`오류가 발생했습니다: ${(e as Error).message}`)
    }
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

  // 보유한 강의실 (paid/active/completed인 주문에서 추출)
  const ownedClassrooms = useMemo(() => {
    const slugs = new Set<string>()
    for (const o of orders) {
      if (!['paid', 'active', 'completed'].includes(o.status)) continue
      const arr = (o as any).classrooms
      if (Array.isArray(arr)) {
        for (const s of arr) slugs.add(String(s))
      }
    }
    return CLASSROOMS.filter((c) => slugs.has(c.slug))
  }, [orders])

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-sub">로딩 중...</p></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-3xl font-bold text-ink mb-8">마이페이지</h1>

          {/* 프로필 */}
          <div className="p-6 rounded-2xl bg-surface border border-line mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center">
                <User className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink">{user.name || '회원'}</h2>
                <p className="text-sub text-sm">{user.role === 'admin' ? '관리자' : '일반 회원'}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-sub" /><span className="text-body">{user.email}</span></div>
              {user.phone && <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-sub" /><span className="text-body">{user.phone}</span></div>}
            </div>
          </div>

          {/* 내 강의실 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-brand" />
              <h3 className="font-medium text-ink">내 강의실</h3>
              <span className="text-xs text-sub">({ownedClassrooms.length}개)</span>
            </div>
            {ownedClassrooms.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-line text-center">
                <p className="text-sm text-sub mb-3">아직 수강 중인 강의가 없습니다.</p>
                <Link
                  href="/classroom"
                  className="inline-block text-xs text-brand hover:underline"
                >
                  강의 둘러보기 →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {ownedClassrooms.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/classroom/${c.slug}`}
                    className="block p-4 rounded-xl border border-line hover:border-[#D4756E] hover:bg-brand-light transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-brand-light text-brand mb-1">
                          {c.level}
                        </div>
                        <p className="font-medium text-ink text-sm">{c.shortTitle}</p>
                      </div>
                      <span className="text-brand text-sm">입장 →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 주문 내역 */}
          <div className="mb-6">
            <button
              onClick={() => setShowOrders(!showOrders)}
              className="w-full p-4 rounded-xl border border-line flex items-center justify-between hover:bg-surface transition-all"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand" />
                <div className="text-left">
                  <h3 className="font-medium text-ink">주문 내역</h3>
                  <p className="text-xs text-sub">{orders.length}건</p>
                </div>
              </div>
              {showOrders ? <ChevronUp className="w-5 h-5 text-sub" /> : <ChevronDown className="w-5 h-5 text-sub" />}
            </button>

            {showOrders && (
              <div className="mt-2 space-y-2">
                {orders.length === 0 ? (
                  <p className="p-4 text-center text-sm text-sub">주문 내역이 없습니다.</p>
                ) : (
                  orders.map((order: any) => {
                    const st = statusLabels[order.status] || statusLabels.pending
                    return (
                      <div key={order.id} className="p-4 rounded-xl border border-line">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-ink text-sm">{order.productName}</p>
                            <p className="text-xs text-sub">{order.orderNumber}</p>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.color + '20', color: st.color }}>
                            {st.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-ink">{order.amount?.toLocaleString()}원</span>
                          <div className="flex gap-2">
                            {order.receiptUrl && (
                              <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-sub hover:text-ink underline">영수증</a>
                            )}
                            {(order.status === 'paid' || order.status === 'active') && (
                              <button onClick={() => handleRefundRequest(order.id)} className="text-xs text-red-400 hover:text-red-600 underline">환불 신청</button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-sub mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('ko-KR') : ''}</p>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {/* 메뉴 */}
          <div className="space-y-2">
            <Link href="/store" className="block p-4 rounded-xl border border-line hover:border-[#D4756E]/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-ink">강의/책</h3>
                  <p className="text-xs text-sub">구매 가능한 콘텐츠 보기</p>
                </div>
                <span className="text-sub">&rarr;</span>
              </div>
            </Link>

            <Link href="/labs" className="block p-4 rounded-xl border border-line hover:border-[#D4756E]/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-ink">AI 실험실</h3>
                  <p className="text-xs text-sub">무료 AI 체험 프로그램</p>
                </div>
                <span className="text-sub">&rarr;</span>
              </div>
            </Link>

            {user.role === 'admin' && (
              <Link href="/manager" className="block p-4 rounded-xl border border-[#D4756E]/20 bg-brand/5 hover:bg-brand/10 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-brand">관리자 대시보드</h3>
                    <p className="text-xs text-brand/60">사이트 관리 페이지</p>
                  </div>
                  <span className="text-brand">&rarr;</span>
                </div>
              </Link>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-8 py-3 border border-line rounded-xl text-sub hover:text-ink hover:border-[#333] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" /> 로그아웃
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full mt-3 py-2 text-xs text-hint hover:text-[#EF4444] transition-colors"
          >
            회원탈퇴
          </button>
        </div>
      </section>
    </div>
  )
}
