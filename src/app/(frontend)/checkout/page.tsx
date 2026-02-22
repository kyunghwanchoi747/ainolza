'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { Lock, ArrowLeft, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, total, user, isLoadingUser } = useCart()
  const router = useRouter()
  const [shippingInfo, setShippingInfo] = useState({
    receiverName: '',
    receiverPhone: '',
    address: '',
    addressDetail: '',
    memo: '',
  })
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (user?.nickname) {
      setShippingInfo((prev) => ({ ...prev, receiverName: user.nickname || '' }))
    }
  }, [user])

  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items, router])

  const hasPhysical = items.some((i) => i.productType === 'products')

  const handlePay = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/checkout')}`)
      return
    }
    if (hasPhysical && (!shippingInfo.receiverName || !shippingInfo.receiverPhone || !shippingInfo.address)) {
      alert('배송 정보를 모두 입력해주세요.')
      return
    }
    setPaying(true)

    const paymentId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const orderName =
      items.length === 1 ? items[0].title : `${items[0].title} 외 ${items.length - 1}건`

    // Store checkout data for after payment
    sessionStorage.setItem(
      `checkout_${paymentId}`,
      JSON.stringify({ shippingInfo, items, total }),
    )

    // Free checkout: skip payment gateway
    if (total === 0) {
      router.push(`/checkout/success?paymentId=${paymentId}&isFree=true`)
      return
    }

    try {
      const PortOne = await import('@portone/browser-sdk/v2')
      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || '',
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || '',
        paymentId,
        orderName,
        totalAmount: total,
        currency: 'KRW',
        payMethod: 'CARD',
        redirectUrl: `${window.location.origin}/checkout/success`,
        customer: {
          fullName: user?.nickname || shippingInfo.receiverName || '고객',
          ...(user?.email ? { email: user.email } : {}),
          ...(shippingInfo.receiverPhone ? { phoneNumber: shippingInfo.receiverPhone } : {}),
        },
      })

      if (response?.code) {
        // Error
        sessionStorage.removeItem(`checkout_${paymentId}`)
        alert(response.message || '결제에 실패했습니다.')
        setPaying(false)
      }
      // Success case is handled by redirect to /checkout/success
    } catch (err: any) {
      sessionStorage.removeItem(`checkout_${paymentId}`)
      if (err?.code !== 'USER_CANCEL') {
        alert(err?.message || '결제 중 오류가 발생했습니다.')
      }
      setPaying(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/cart"
          className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          장바구니로
        </Link>

        <h1 className="mb-8 text-3xl font-black text-white">결제</h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: Info Forms */}
          <div className="flex-1 space-y-6">
            {/* Buyer Info */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <h2 className="mb-6 text-lg font-black text-white">주문자 정보</h2>
              {user ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">이메일</span>
                    <span className="font-bold text-white">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">닉네임</span>
                    <span className="font-bold text-white">{user.nickname || '미설정'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-yellow-400">
                  <Link href="/login" className="underline font-bold">
                    로그인
                  </Link>
                  하면 주문 내역이 저장됩니다.
                </p>
              )}
            </div>

            {/* Shipping Info (physical products only) */}
            {hasPhysical && (
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
                <h2 className="mb-6 text-lg font-black text-white">배송 정보</h2>
                <div className="space-y-4">
                  {[
                    { name: 'receiverName', label: '수령인', placeholder: '받으실 분 성함' },
                    { name: 'receiverPhone', label: '연락처', placeholder: '010-0000-0000', type: 'tel' },
                    { name: 'address', label: '주소', placeholder: '도로명 주소' },
                    { name: 'addressDetail', label: '상세주소', placeholder: '동/호수' },
                    { name: 'memo', label: '배송메모', placeholder: '문 앞에 놓아주세요' },
                  ].map(({ name, label, placeholder, type }) => (
                    <div key={name}>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-500">
                        {label}
                      </label>
                      <input
                        type={type || 'text'}
                        value={shippingInfo[name as keyof typeof shippingInfo]}
                        onChange={(e) =>
                          setShippingInfo((prev) => ({ ...prev, [name]: e.target.value }))
                        }
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500 focus:bg-white/10"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary + Pay Button */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="sticky top-24 rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <h2 className="mb-6 text-lg font-black text-white">결제 요약</h2>

              <div className="space-y-3 border-b border-white/10 pb-6 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate mr-2 flex-1">{item.title}</span>
                    <span className="font-bold text-white shrink-0">
                      {item.price === 0
                        ? '무료'
                        : `${(item.price * item.quantity).toLocaleString()}원`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-white">최종 결제</span>
                <span className="text-2xl font-black text-white">
                  {total === 0 ? '무료' : `${total.toLocaleString()}원`}
                </span>
              </div>

              {!isLoadingUser && !user && (
                <p className="mb-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-center text-xs font-bold text-yellow-400">
                  결제하려면 로그인이 필요합니다
                </p>
              )}
              <button
                onClick={handlePay}
                disabled={paying || isLoadingUser}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black text-black hover:bg-blue-50 transition-colors shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CreditCard className="h-5 w-5" />
                {paying
                  ? (total === 0 ? '처리 중...' : '결제창 열림...')
                  : (!isLoadingUser && !user ? '로그인하고 결제하기' : total === 0 ? '무료로 받기' : '결제하기')}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-gray-600">
                <Lock className="h-3 w-3" />
                포트원 안전 결제
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
