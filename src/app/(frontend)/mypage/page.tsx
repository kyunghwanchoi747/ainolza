'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Phone, LogOut, ShoppingBag, ChevronDown, ChevronUp, GraduationCap, Star, MessageSquare } from 'lucide-react'

type ClassroomMeta = { slug: string; shortTitle: string; level: string; description?: string }

type EbookMeta = {
  slug: string
  title: string
  hasFile?: boolean // R2에 ebookFile 등록 여부
  legacyDownloadUrl?: string // 구 외부 링크 (ebookFile 없을 때 fallback)
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
  const [myReviews, setMyReviews] = useState<any[]>([])
  // 모든 게시 상품 (productSlug 누락 주문의 fallback 매핑용)
  const [allProducts, setAllProducts] = useState<{
    slug: string
    title: string
    productType?: string
    grantedClassroomSlugs: string[]
  }[]>([])
  // 작성/수정 폼 — 어떤 상품에 대해 작성 중인지
  const [reviewForm, setReviewForm] = useState<{
    productId: number
    productName: string
    productType?: string
    reviewId?: number // 있으면 수정 모드
    rating: number
    content: string
    siteUrl: string
  } | null>(null)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewReloadKey, setReviewReloadKey] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch('/api/users/me', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch('/api/payments', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch('/api/classrooms?limit=100&depth=0', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch('/api/products?where[productType][equals]=ebook&limit=100&depth=0', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      // 모든 상품 (draft 포함) — 1기 종료된 상품도 마이페이지엔 표시되어야 함
      fetch('/api/products?limit=200&depth=0', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
    ])
      .then(([userData, orderData, classroomData, ebookData, allProductsData]: any[]) => {
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
            hasFile: !!d.ebookFile,
            legacyDownloadUrl: d.downloadUrl,
            downloadNote: d.downloadNote,
          })))
          const all = (allProductsData?.docs || []) as any[]
          setAllProducts(all.map((d) => {
            const arr = Array.isArray(d.grantedClassroomSlugs) ? d.grantedClassroomSlugs : []
            const grantedClassroomSlugs: string[] = []
            for (const item of arr) {
              const slug = typeof item === 'object' ? item.slug : item
              if (slug && !grantedClassroomSlugs.includes(slug)) grantedClassroomSlugs.push(slug)
            }
            return {
              slug: d.slug,
              title: d.title,
              productType: d.productType,
              grantedClassroomSlugs,
            }
          }))
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  // 내가 작성한 후기 목록 (depth=1 → product 정보 포함)
  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/reviews?where[user][equals]=${user.id}&limit=100&depth=1`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then((data: any) => {
        setMyReviews(data?.docs || [])
      })
      .catch(() => setMyReviews([]))
  }, [user?.id, reviewReloadKey])

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
    if (!user || !reviewForm || !reviewForm.content.trim()) return
    setReviewSubmitting(true)
    try {
      const body: Record<string, any> = {
        rating: reviewForm.rating,
        content: reviewForm.content.trim(),
        siteUrl: reviewForm.siteUrl.trim() || null,
        product: reviewForm.productId,
        status: 'approved',
      }
      let res: Response
      if (reviewForm.reviewId) {
        // 수정 — product는 변경 안 함 (이미 매핑된 상태)
        delete body.product
        res = await fetch(`/api/reviews/${reviewForm.reviewId}`, {
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
        setReviewReloadKey(k => k + 1)
        setReviewForm(null)
      } else {
        alert('후기 저장에 실패했습니다.')
      }
    } catch {
      alert('후기 저장 중 오류가 발생했습니다.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  // 후기 삭제
  const handleReviewDelete = async (reviewId: number) => {
    if (!confirm('이 후기를 삭제하시겠습니까?')) return
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) setReviewReloadKey(k => k + 1)
    } catch {
      alert('삭제에 실패했습니다.')
    }
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

  // 보유한 전자책 — slug별 가장 최근 paid 주문 1건과 매칭 (orderId 필요)
  const ownedEbooks = useMemo(() => {
    const latestOrderBySlug = new Map<string, any>()
    for (const o of orders) {
      if (!['paid', 'active', 'completed'].includes(o.status)) continue
      if ((o as any).productType !== 'ebook') continue
      const slug = (o as any).productSlug
      if (!slug) continue
      const prev = latestOrderBySlug.get(slug)
      const oTime = new Date(o.createdAt || 0).getTime()
      const pTime = prev ? new Date(prev.createdAt || 0).getTime() : 0
      if (!prev || oTime > pTime) latestOrderBySlug.set(slug, o)
    }
    return ebookMeta
      .filter((b) => latestOrderBySlug.has(b.slug))
      .map((b) => ({ ...b, orderId: latestOrderBySlug.get(b.slug)!.id as number | string }))
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

              {/* 저작권 안내 — 다운로드 버튼 위 한 번만 노출 */}
              <div className="mb-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-700 leading-relaxed">
                <strong className="block mb-0.5 text-red-800">⚠ 저작권 보호 안내</strong>
                본 전자책의 무단 복제·배포·공유·전송은 「저작권법」 제136조에 따라
                <strong> 5년 이하의 징역 또는 5천만원 이하의 벌금</strong>에 처해질 수 있습니다.
                다운로드 링크는 본인 외 공유하지 마세요.
              </div>

              <div className="space-y-2">
                {ownedEbooks.map((b) => {
                  const canDownload = b.hasFile || !!b.legacyDownloadUrl
                  return (
                    <div
                      key={b.slug}
                      className="p-4 rounded-xl border border-line"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 text-blue-600 mb-1">전자책</div>
                          <p className="font-medium text-ink text-sm">{b.title}</p>
                        </div>
                        {canDownload ? (
                          b.hasFile ? (
                            // R2 보안 다운로드 (인증·권한 검증 후 워커에서 직접 스트리밍)
                            <a
                              href={`/api/download/${b.orderId}`}
                              className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-bold hover:bg-brand-dark transition-colors whitespace-nowrap"
                            >
                              다운로드
                            </a>
                          ) : (
                            // 레거시 외부 링크 (구 상품 호환)
                            <a
                              href={b.legacyDownloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-bold hover:bg-brand-dark transition-colors whitespace-nowrap"
                            >
                              다운로드
                            </a>
                          )
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
                  )
                })}
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

          {/* 수강/구매 상품별 후기 */}
          {(() => {
            // 구매한 상품 목록 (paid·active·completed) — 중복 제거
            // productSlug가 비어있으면 classrooms 또는 productName으로 역매핑 (legacy 주문 호환)
            const purchased = new Map<string, { productId: number; productSlug: string; productName: string; productType?: string }>()
            const productBySlug = new Map(allProducts.map(p => [p.slug, p]))
            // grantedClassroomSlugs.includes(classroomSlug) 매칭용 인덱스
            const productByClassroomSlug = new Map<string, typeof allProducts[0]>()
            for (const p of allProducts) {
              for (const cs of p.grantedClassroomSlugs) {
                if (!productByClassroomSlug.has(cs)) productByClassroomSlug.set(cs, p)
              }
            }
            const productByName = new Map(allProducts.map(p => [p.title, p]))

            // classroomSlug → product 매칭 (4단계 폴백)
            const matchClassroomToProduct = (classroomSlug: string): typeof allProducts[0] | undefined => {
              // 1) grantedClassroomSlugs에 정확히 포함된 상품
              const direct = productByClassroomSlug.get(classroomSlug)
              if (direct) return direct
              // 2) 상품 slug가 classroomSlug와 정확히 일치 (예: 둘 다 'vibe-coding-101')
              const exact = productBySlug.get(classroomSlug)
              if (exact) return exact
              // 3) classroomSlug가 어떤 상품 slug로 시작 (예: classroom='vibe-coding-101-2', product='vibe-coding-101')
              for (const p of allProducts) {
                if (classroomSlug.startsWith(p.slug + '-') || classroomSlug === p.slug) return p
              }
              // 4) 상품 slug가 classroomSlug로 시작 (역방향)
              for (const p of allProducts) {
                if (p.slug.startsWith(classroomSlug + '-') || p.slug === classroomSlug) return p
              }
              return undefined
            }

            for (const o of orders) {
              if (!['paid', 'active', 'completed'].includes(o.status)) continue
              let slug: string | undefined = o.productSlug
              let productMeta = slug ? productBySlug.get(slug) : undefined

              // Fallback 1: classrooms 배열 → 다단계 매칭
              if (!productMeta) {
                const classroomList: string[] = Array.isArray(o.classrooms) ? o.classrooms : []
                for (const cs of classroomList) {
                  const m = matchClassroomToProduct(cs)
                  if (m) {
                    productMeta = m
                    slug = m.slug
                    break
                  }
                }
              }

              // Fallback 2: productName 정확 매칭 ([테스트] 접두사 제거 후 비교)
              if (!productMeta && o.productName) {
                const cleaned = String(o.productName).replace(/^\[테스트\]\s*/, '').trim()
                const m = productByName.get(cleaned)
                if (m) {
                  productMeta = m
                  slug = m.slug
                }
              }

              if (!slug || purchased.has(slug)) continue
              purchased.set(slug, {
                productId: 0, // 작성 클릭 시 lookup
                productSlug: slug,
                productName: productMeta?.title || o.productName || slug,
                productType: productMeta?.productType || o.productType,
              })
            }
            // 작성한 후기를 product slug 기준 매핑
            const reviewByProductSlug = new Map<string, any>()
            for (const r of myReviews) {
              const p = typeof r.product === 'object' && r.product ? r.product : null
              if (p?.slug) reviewByProductSlug.set(p.slug, r)
            }

            const purchasedList = Array.from(purchased.values())

            // 작성된 후기인데 구매 목록에 없는 경우(상품이 사라졌거나 매핑 누락) — 별도로 표시
            const orphanReviews = myReviews.filter((r) => {
              const p = typeof r.product === 'object' && r.product ? r.product : null
              if (!p?.slug) return true // 상품 미지정 후기
              return !purchased.has(p.slug)
            })

            const openCreateForm = async (slug: string, fallback: { productName: string; productType?: string }) => {
              // slug로 productId 조회 (캐시 없음 → 1회 fetch)
              try {
                const res = await fetch(`/api/products?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`, { credentials: 'include' })
                const data = (await res.json()) as { docs?: any[] }
                const p = data.docs?.[0]
                if (!p?.id) {
                  alert('상품 정보를 불러올 수 없습니다.')
                  return
                }
                setReviewForm({
                  productId: p.id,
                  productName: p.title || fallback.productName,
                  productType: p.productType || fallback.productType,
                  rating: 5,
                  content: '',
                  siteUrl: '',
                })
              } catch {
                alert('상품 정보를 불러올 수 없습니다.')
              }
            }

            const openEditForm = (review: any) => {
              const p = typeof review.product === 'object' && review.product ? review.product : null
              setReviewForm({
                productId: p?.id || 0,
                productName: p?.title || '내 후기',
                productType: p?.productType,
                reviewId: review.id,
                rating: review.rating || 5,
                content: review.content || '',
                siteUrl: review.siteUrl || '',
              })
            }

            return (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-brand" />
                  <h3 className="font-medium text-ink">내 후기</h3>
                  <span className="text-xs text-sub">({myReviews.length}개)</span>
                </div>

                {/* 후기 작성 폼 (상품 선택된 상태) */}
                {reviewForm && (
                  <form onSubmit={handleReviewSubmit} className="mb-4 p-5 rounded-2xl border-2 border-brand/30 bg-brand-light/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-ink text-sm">
                        {reviewForm.reviewId ? '후기 수정' : '후기 작성'} —{' '}
                        <span className="text-brand">{reviewForm.productName}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setReviewForm(null)}
                        className="text-xs text-sub hover:text-ink"
                      >
                        취소 ✕
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-sub mb-1.5">별점</p>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(n => (
                          <button key={n} type="button" onClick={() => setReviewForm(f => f ? { ...f, rating: n } : f)}>
                            <Star className={`w-7 h-7 transition-colors ${n <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-sub mb-1.5">후기 내용</p>
                      <textarea
                        value={reviewForm.content}
                        onChange={e => setReviewForm(f => f ? { ...f, content: e.target.value } : f)}
                        rows={4}
                        required
                        placeholder={`${reviewForm.productName} 사용 경험을 자유롭게 작성해주세요`}
                        className="w-full px-4 py-3 rounded-xl border-2 border-line bg-white text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors resize-none text-sm"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-sub mb-1.5">내 사이트 URL <span className="text-hint">(선택)</span></p>
                      <input
                        type="url"
                        value={reviewForm.siteUrl}
                        onChange={e => setReviewForm(f => f ? { ...f, siteUrl: e.target.value } : f)}
                        placeholder="https://my-site.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-line bg-white text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors text-sm"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={reviewSubmitting || !reviewForm.content.trim()}
                        className="px-5 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50 text-sm"
                      >
                        {reviewSubmitting ? '저장 중...' : '저장'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewForm(null)}
                        className="px-5 py-2.5 border border-line text-sub font-medium rounded-xl hover:bg-white transition-all text-sm"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                )}

                {/* 구매한 상품별 카드 */}
                {purchasedList.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-line text-center">
                    <p className="text-sm text-sub">구매한 상품이 없습니다. 결제 후 후기를 작성할 수 있어요.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {purchasedList.map((p) => {
                      const review = reviewByProductSlug.get(p.productSlug)
                      const typeLabel =
                        p.productType === 'class' ? '강의' :
                        p.productType === 'ebook' ? '전자책' :
                        p.productType === 'book' ? '종이책' :
                        p.productType === 'bundle' ? '번들' : ''
                      return (
                        <div key={p.productSlug} className="p-4 rounded-xl border border-line bg-white">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {typeLabel && (
                                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-brand-light text-brand">
                                    {typeLabel}
                                  </span>
                                )}
                                <p className="font-medium text-ink text-sm">{p.productName}</p>
                              </div>
                            </div>
                            {review ? (
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => openEditForm(review)}
                                  className="text-xs px-3 py-1.5 rounded-lg border border-line text-sub font-medium hover:bg-surface transition-colors"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleReviewDelete(review.id)}
                                  className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors"
                                >
                                  삭제
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => openCreateForm(p.productSlug, { productName: p.productName, productType: p.productType })}
                                className="text-xs px-3 py-1.5 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors shrink-0"
                              >
                                후기 작성
                              </button>
                            )}
                          </div>
                          {review ? (
                            <div className="mt-2 pt-3 border-t border-line">
                              <div className="flex items-center gap-1 mb-2">
                                {[1,2,3,4,5].map(n => (
                                  <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                ))}
                              </div>
                              <p className="text-sm text-body leading-relaxed whitespace-pre-line line-clamp-3">{review.content}</p>
                              {review.siteUrl && (
                                <a href={review.siteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline break-all mt-2 inline-block">
                                  🔗 {review.siteUrl}
                                </a>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-sub mt-1">아직 작성한 후기가 없습니다.</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 구매 목록에 없지만 작성된 후기 (상품 미지정 또는 상품 삭제됨) */}
                {orphanReviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-sub mb-2">
                      ↓ 상품과 매핑되지 않은 후기 ({orphanReviews.length}개)
                    </p>
                    <div className="space-y-2">
                      {orphanReviews.map((r) => {
                        const p = typeof r.product === 'object' && r.product ? r.product : null
                        return (
                          <div key={r.id} className="p-4 rounded-xl border border-dashed border-line bg-surface">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <p className="text-xs text-sub">
                                {p?.title ? `이전 상품: ${p.title}` : '상품 미지정 후기'}
                              </p>
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => openEditForm(r)}
                                  className="text-xs px-3 py-1.5 rounded-lg border border-line text-sub font-medium hover:bg-white transition-colors"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleReviewDelete(r.id)}
                                  className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[1,2,3,4,5].map(n => (
                                <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <p className="text-sm text-body leading-relaxed whitespace-pre-line line-clamp-3">{r.content}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

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
