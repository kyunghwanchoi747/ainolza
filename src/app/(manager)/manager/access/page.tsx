'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { resolveGrantedClassrooms } from '@/lib/classroom-grant'

type User = {
  id: number
  email: string
  name?: string
}

type ProductOption = {
  slug: string
  title: string
  productType: string // 'class' | 'ebook' | 'book' | 'bundle'
  classroomSlugs: string[] // grantedClassroomSlugs
}

type UserOrder = {
  id: number
  orderNumber: string
  productName: string
  productSlug?: string
  productType?: string
  classrooms?: string[]
  status: string
  amount: number
  isTest: boolean
}

const typeLabel = (t: string) =>
  t === 'class' ? '강의' : t === 'ebook' ? '전자책' : t === 'book' ? '종이책' : t === 'bundle' ? '번들' : t

const typeBadgeColor = (t: string): 'default' | 'secondary' | 'success' | 'warning' | 'outline' => {
  switch (t) {
    case 'class': return 'default'
    case 'ebook': return 'secondary'
    case 'book': return 'warning'
    case 'bundle': return 'success'
    default: return 'outline'
  }
}

export default function AccessGrantPage() {
  const [emailQuery, setEmailQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [productOptions, setProductOptions] = useState<ProductOption[]>([])
  const [granting, setGranting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [grantedHistory, setGrantedHistory] = useState<{ orderId: number; email: string; productLabel: string }[]>([])
  const [userOrders, setUserOrders] = useState<UserOrder[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  // 게시 중인 모든 상품 로드 (강의/전자책/종이책/번들 전부)
  useEffect(() => {
    fetch('/api/products?where[status][equals]=published&limit=100&depth=0', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then((data: any) => {
        const opts: ProductOption[] = (data?.docs || []).map((d: any) => {
          // grantedClassroomSlugs 비어 있을 경우 코드 fallback도 동일하게 반영하여 표시.
          // 결제 흐름(verify/webhook)과 동일한 매핑 사용 → 화면 표시와 실제 부여 결과 일치.
          const classroomSlugs = resolveGrantedClassrooms(d.slug, d.grantedClassroomSlugs, [])
          return {
            slug: d.slug,
            title: d.title,
            productType: d.productType || 'class',
            classroomSlugs,
          }
        })
        setProductOptions(opts)
        if (opts.length > 0) setSelectedSlug(opts[0].slug)
      })
      .catch(() => {})
  }, [])

  // 선택된 회원의 주문 목록 (paid)
  const loadUserOrders = async (userId: number) => {
    setLoadingOrders(true)
    try {
      const res = await fetch(
        `/api/orders?where[and][0][user][equals]=${userId}&where[and][1][status][equals]=paid&limit=50`,
        { credentials: 'include' },
      )
      const data = (await res.json()) as { docs?: any[] }
      const orders: UserOrder[] = (data.docs || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        productName: o.productName,
        productSlug: o.productSlug,
        productType: o.productType,
        classrooms: o.classrooms || [],
        status: o.status,
        amount: o.amount || 0,
        isTest: typeof o.orderNumber === 'string' && o.orderNumber.startsWith('TEST_'),
      }))
      setUserOrders(orders)
    } catch {
      setUserOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    if (selectedUser) {
      loadUserOrders(selectedUser.id)
    } else {
      setUserOrders([])
    }
  }, [selectedUser])

  // 이메일 검색
  useEffect(() => {
    if (emailQuery.trim().length < 2) {
      setResults([])
      return
    }
    const handle = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `/api/users?where[email][contains]=${encodeURIComponent(emailQuery.trim())}&limit=10`,
          { credentials: 'include' },
        )
        const data = (await res.json()) as { docs?: User[] }
        setResults(data.docs || [])
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(handle)
  }, [emailQuery])

  const grant = async () => {
    if (!selectedUser || !selectedSlug) {
      setMessage({ type: 'error', text: '회원과 상품을 선택해주세요.' })
      return
    }
    setGranting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/manager/grant-classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: selectedUser.id, productSlug: selectedSlug }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        already?: boolean
        message?: string
        error?: string
        orderId?: number
      }
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || '권한 부여 실패' })
        return
      }
      const product = productOptions.find((p) => p.slug === selectedSlug)
      const productLabel = product?.title || selectedSlug
      setMessage({
        type: 'success',
        text: data.already
          ? `${selectedUser.email} 은(는) 이미 [${productLabel}] 권한이 있습니다.`
          : data.message || '권한이 부여되었습니다.',
      })
      if (data.orderId && !data.already) {
        setGrantedHistory((h) => [
          { orderId: data.orderId!, email: selectedUser.email, productLabel },
          ...h,
        ])
      }
      await loadUserOrders(selectedUser.id)
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message })
    } finally {
      setGranting(false)
    }
  }

  const revokeOrder = async (orderId: number, isTest: boolean) => {
    if (!isTest) {
      setMessage({ type: 'error', text: '실제 구매 주문은 회수할 수 없습니다. 환불 처리를 이용하세요.' })
      return
    }
    if (!confirm('이 테스트 주문을 삭제(회수)하시겠습니까?')) return
    try {
      const params = new URLSearchParams({ orderId: String(orderId) })
      const res = await fetch(`/api/manager/grant-classroom?${params.toString()}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setGrantedHistory((h) => h.filter((x) => x.orderId !== orderId))
        setMessage({ type: 'success', text: '권한이 회수되었습니다.' })
        if (selectedUser) await loadUserOrders(selectedUser.id)
      } else {
        const data = await res.json() as { error?: string }
        setMessage({ type: 'error', text: data.error || '회수 실패' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">상품 권한 부여</h1>
        <p className="text-muted-foreground mt-1">
          테스트용으로 특정 회원에게 상품(강의/전자책/종이책) 액세스 권한을 부여합니다.
          내부적으로 amount=0인 테스트 주문(<code>TEST_*</code>)을 생성하므로 매출 통계엔 영향 없습니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. 회원 선택</CardTitle>
          <CardDescription>이메일 일부를 입력해 회원을 검색하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            placeholder="이메일 검색 (예: gmail)"
          />
          {searching && <p className="text-sm text-muted-foreground">검색 중...</p>}
          {results.length > 0 && (
            <div className="border rounded-md divide-y max-h-64 overflow-auto">
              {results.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                    selectedUser?.id === u.id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{u.email}</p>
                      {u.name && <p className="text-xs text-muted-foreground">{u.name}</p>}
                    </div>
                    {selectedUser?.id === u.id && <Badge>선택됨</Badge>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {selectedUser && (
            <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium">선택된 회원</p>
              <p className="text-sm text-muted-foreground">
                {selectedUser.name && `${selectedUser.name} · `}
                {selectedUser.email} (id: {selectedUser.id})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>현재 보유 상품</CardTitle>
            <CardDescription>
              결제완료(paid) 주문 목록입니다. 테스트 주문(<code>TEST_*</code>)만 회수할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            ) : userOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">결제완료 주문이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {userOrders.map((o) => (
                  <div
                    key={o.id}
                    className={`p-3 border rounded-md ${o.isTest ? 'bg-amber-50 border-amber-200' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className="text-sm font-medium truncate">{o.productName}</p>
                          {o.productType && (
                            <Badge variant={typeBadgeColor(o.productType)} className="text-[10px]">
                              {typeLabel(o.productType)}
                            </Badge>
                          )}
                          {o.isTest && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-medium">
                              TEST
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {o.orderNumber} · {o.amount.toLocaleString()}원
                          {o.productSlug && ` · ${o.productSlug}`}
                        </p>
                        {Array.isArray(o.classrooms) && o.classrooms.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {o.classrooms.map((s) => (
                              <Badge key={s} variant="outline" className="text-[10px]">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {o.isTest && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                          onClick={() => revokeOrder(o.id, o.isTest)}
                        >
                          회수
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>2. 상품 선택</CardTitle>
          <CardDescription>강의·전자책·종이책 모두 부여 가능합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {productOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">게시 중인 상품이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {productOptions.map((p) => (
                <label
                  key={p.slug}
                  className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50 ${
                    selectedSlug === p.slug ? 'bg-primary/5 border-primary' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="product"
                    value={p.slug}
                    checked={selectedSlug === p.slug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{p.title}</span>
                      <Badge variant={typeBadgeColor(p.productType)} className="text-[10px]">
                        {typeLabel(p.productType)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {p.slug}
                      {p.classroomSlugs.length > 0 && ` → 강의실: ${p.classroomSlugs.join(', ')}`}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. 권한 부여</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={grant} disabled={granting || !selectedUser}>
            {granting ? '처리 중...' : '권한 부여하기'}
          </Button>
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>

      {grantedHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>이번 세션에서 부여한 권한</CardTitle>
            <CardDescription>회수 버튼으로 즉시 해제할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {grantedHistory.map((g) => (
                <div
                  key={g.orderId}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="text-sm">
                    <span className="font-medium">{g.email}</span>
                    <span className="text-muted-foreground"> · {g.productLabel}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => revokeOrder(g.orderId, true)}>
                    회수
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
