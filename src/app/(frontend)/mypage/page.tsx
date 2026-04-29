'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Phone, LogOut, ShoppingBag, ChevronDown, ChevronUp, GraduationCap, Star, MessageSquare } from 'lucide-react'

type ClassroomMeta = { slug: string; shortTitle: string; level: string; description?: string }

type EbookMeta = {
  slug: string
  title: string
  downloadUrl?: string
  downloadNote?: string
}

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
  const [classroomMeta, setClassroomMeta] = useState<ClassroomMeta[]>([])
  const [ebookMeta, setEbookMeta] = useState<EbookMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [showOrders, setShowOrders] = useState(false)
  const [myReview, setMyReview] = useState<any>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [reviewSiteUrl, setReviewSiteUrl] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/users/me', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch('/api/payments', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch('/api/classrooms?limit=100&depth=0', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch('/api/products?where[productType][equals]=ebook&limit=100&depth=0', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
    ])
      .then(([userData, orderData, classroomData, ebookData]: any[]) => {
        if (userData?.user) {
          setUser(userData.user)
          setOrders(orderData?.orders || [])
          const docs = (classroomData?.docs || []) as any[]
          setClassroomMeta(docs.map((d) => ({
            slug: d.slug,
            shortTitle: d.shortTitle || d.title,
            level: d.level || '입문',
            description: d.description,
          })))
          const ebooks = (ebookData?.docs || []) as any[]
          setEbookMeta(ebooks.map((d) => ({
            slug: d.slug,
            title: d.title,
            downloadUrl: d.downloadUrl,
            downloadNote: d.downloadNote,
          })))
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  // 내 후기 불러오기
  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/reviews?where[user][equals]=${user.id}&limit=1`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then((data: any) => {
        if (data?.docs?.length > 0) {
          const r = data.docs[0]
          setMyReview(r)
          setReviewRating(r.rating)
          setReviewContent(r.content)
          setReviewSiteUrl(r.siteUrl || '')
        }
      })
      .catch(() => {})
  }, [user?.id, reviewSubmitted])

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !reviewContent.trim()) return
    setReviewSubmitting(true)
    try {
      const body = { rating: reviewRating, content: reviewContent.trim(), siteUrl: reviewSiteUrl.trim() || null }
      let res: Response
      if (myReview) {
        res = await fetch(`/api/reviews/${myReview.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        })
      }
      if (res.ok || res.status === 201) {
        setReviewSubmitted(prev => !prev)
        setShowReviewForm(false)
      }
    } catch {}
    finally { setReviewSubmitting(false) }
  }

  const SERVICE_DAYS = 100

  // 결제일 기준 수강 만료일 계산
  const getExpiry = (slug: string): { date: Date; expired: boolean; daysLeft: number } | null => {
    for (const o of orders) {
      if (!['paid', 'active', 'completed'].includes(o.status)) continue
      const arr = (o as any).classrooms
      if (Array.isArray(arr) && arr.map(String).includes(slug)) {
        const paidAt = new Date((o as any).paidAt || (o as any).createdAt)
        const expiry = new Date(paidAt)
        expiry.setDate(expiry.getDate() + SERVICE_DAYS)
        const now = new Date()
        const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return { date: expiry, expired: daysLeft <= 0, daysLeft }
      }
    }
    return null
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
    return classroomMeta.filter((c) => slugs.has(c.slug))
  }, [orders, classroomMeta])

  // 보유한 전자책 (paid/active/completed 주문 + productType ebook)
  const ownedEbooks = useMemo(() => {
    const slugs = new Set<string>()
    for (const o of orders) {
      if (!['paid', 'active', 'completed'].includes(o.status)) continue
      if ((o as any).productType !== 'ebook') continue
      const slug = (o as any).productSlug
      if (slug) slugs.add(String(slug))
    }
    return ebookMeta.filter((b) => slugs.has(b.slug))
  }, [orders, ebookMeta])

  // 종이책 주문 (배송 추적용)
  const bookOrders = useMemo(() => {
    return orders.filter((o: any) =>
      ['paid', 'active', 'completed'].includes(o.status) &&
      o.productType === 'book' &&
      o.shippingAddress,
    )
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
                {ownedClassrooms.map((c) => {
                  const expiry = getExpiry(c.slug)
                  const expired = expiry?.expired ?? false
                  return expired ? (
                    <div
                      key={c.slug}
                      className="block p-4 rounded-xl border border-line bg-[#fafafa] opacity-60"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-400 mb-1">
                            {c.level}
                          </div>
                          <p className="font-medium text-sub text-sm line-through">{c.shortTitle}</p>
                          <p className="text-[11px] text-red-400 font-medium mt-0.5">
                            수강 기간 종료 ({expiry!.date.toLocaleDateString('ko-KR')} 만료)
                          </p>
                        </div>
                        <span className="text-gray-300 text-sm">종료</span>
                      </div>
                    </div>
                  ) : (
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
                          {expiry && (
                            <p className={`text-[11px] mt-0.5 font-medium ${expiry.daysLeft <= 14 ? 'text-orange-400' : 'text-sub'}`}>
                              수강 기간 D-{expiry.daysLeft} ({expiry.date.toLocaleDateString('ko-KR')} 까지)
                            </p>
                          )}
                        </div>
                        <span className="text-brand text-sm">입장 →</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* 내 전자책 */}
          {ownedEbooks.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-5 h-5 text-brand" />
                <h3 className="font-medium text-ink">내 전자책</h3>
                <span className="text-xs text-sub">({ownedEbooks.length}권)</span>
              </div>
              <div className="space-y-2">
                {ownedEbooks.map((b) => (
                  <div
                    key={b.slug}
                    className="p-4 rounded-xl border border-line"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 text-blue-600 mb-1">전자책</div>
                        <p className="font-medium text-ink text-sm">{b.title}</p>
                      </div>
                      {b.downloadUrl ? (
                        <a
                          href={b.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-bold hover:bg-brand-dark transition-colors whitespace-nowrap"
                        >
                          다운로드
                        </a>
                      ) : (
                        <span className="text-xs text-sub">준비 중</span>
                      )}
                    </div>
                    {b.downloadNote && (
                      <p className="text-[11px] text-orange-600 mt-2 leading-relaxed">
                        ⚠ {b.downloadNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 종이책 배송 현황 */}
          {bookOrders.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-5 h-5 text-brand" />
                <h3 className="font-medium text-ink">종이책 배송</h3>
                <span className="text-xs text-sub">({bookOrders.length}건)</span>
              </div>
              <div className="space-y-2">
                {bookOrders.map((o: any) => {
                  const shippingStatusLabels: Record<string, { label: string; color: string }> = {
                    pending: { label: '발송 대기', color: '#F59E0B' },
                    preparing: { label: '발송 준비중', color: '#3B82F6' },
                    shipping: { label: '배송중', color: '#10B981' },
                    delivered: { label: '배송완료', color: '#6B7280' },
                  }
                  const ss = shippingStatusLabels[o.shippingStatus || 'pending'] || shippingStatusLabels.pending
                  return (
                    <div key={o.id} className="p-4 rounded-xl border border-line">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700 mb-1">종이책</div>
                          <p className="font-medium text-ink text-sm">{o.productName}</p>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                          style={{ backgroundColor: ss.color + '20', color: ss.color }}
                        >
                          {ss.label}
                        </span>
                      </div>
                      <div className="text-xs text-sub mt-2 space-y-0.5 leading-relaxed">
                        <p>받는 사람: {o.shippingRecipient} ({o.shippingPhone})</p>
                        <p>주소: ({o.shippingZipcode}) {o.shippingAddress} {o.shippingAddressDetail}</p>
                        {o.trackingNumber && (
                          <p className="text-brand">
                            운송장: {o.shippingCarrier || '택배'} {o.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 수강 후기 */}
          <div className="mb-6 p-6 rounded-2xl border border-line bg-surface">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand" />
                <h3 className="font-medium text-ink">수강 후기</h3>
              </div>
              {!showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors"
                >
                  {myReview ? '후기 수정' : '후기 작성'}
                </button>
              )}
            </div>

            {/* 기존 후기 표시 */}
            {myReview && !showReviewForm && (
              <div className="p-4 rounded-xl bg-white border border-line">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={`w-4 h-4 ${n <= myReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-body leading-relaxed whitespace-pre-line mb-2">{myReview.content}</p>
                {myReview.siteUrl && (
                  <a href={myReview.siteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline break-all">
                    🔗 {myReview.siteUrl}
                  </a>
                )}
              </div>
            )}

            {/* 후기 미작성 */}
            {!myReview && !showReviewForm && (
              <p className="text-sm text-sub text-center py-4">
                AI놀자 수강 후기를 남기고 내 사이트를 홍보해보세요!
              </p>
            )}

            {/* 작성/수정 폼 */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <p className="text-sm text-sub mb-2">별점</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setReviewRating(n)}>
                        <Star className={`w-7 h-7 transition-colors ${n <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-sub mb-2">후기 내용</p>
                  <textarea
                    value={reviewContent}
                    onChange={e => setReviewContent(e.target.value)}
                    rows={4}
                    required
                    placeholder="수강 경험을 자유롭게 작성해주세요"
                    className="w-full px-4 py-3 rounded-xl border-2 border-line bg-white text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors resize-none text-sm"
                  />
                </div>
                <div>
                  <p className="text-sm text-sub mb-2">내 사이트 URL <span className="text-hint">(선택 — 홈 화면에 링크 노출)</span></p>
                  <input
                    type="url"
                    value={reviewSiteUrl}
                    onChange={e => setReviewSiteUrl(e.target.value)}
                    placeholder="https://my-site.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-line bg-white text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={reviewSubmitting || !reviewContent.trim()}
                    className="px-5 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50 text-sm"
                  >
                    {reviewSubmitting ? '저장 중...' : '저장'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-5 py-2.5 border border-line text-sub font-medium rounded-xl hover:bg-white transition-all text-sm"
                  >
                    취소
                  </button>
                </div>
              </form>
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
