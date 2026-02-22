'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const { user, clearCart, items } = useCart()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [payloadOrderId, setPayloadOrderId] = useState('')
  const confirmed = useRef(false)

  useEffect(() => {
    if (confirmed.current) return
    confirmed.current = true

    // PortOne v2 redirectUrl에서 오는 파라미터
    const paymentId = searchParams.get('paymentId')
    const code = searchParams.get('code')       // 실패 코드
    const errMsg = searchParams.get('message')  // 실패 메시지

    if (code) {
      setStatus('error')
      setMessage(errMsg || '결제에 실패했습니다.')
      return
    }

    if (!paymentId) {
      setStatus('error')
      setMessage('결제 정보가 없습니다.')
      return
    }

    const isFree = searchParams.get('isFree') === 'true'
    const checkoutRaw = sessionStorage.getItem(`checkout_${paymentId}`)
    const checkoutData = checkoutRaw ? JSON.parse(checkoutRaw) : {}
    sessionStorage.removeItem(`checkout_${paymentId}`)

    fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId,
        userId: user?.id,
        items: checkoutData.items || items,
        shippingInfo: checkoutData.shippingInfo,
        isFree,
      }),
    })
      .then((res) => res.json())
      .then((data: { success?: boolean; orderId?: string; message?: string }) => {
        if (data.success) {
          clearCart()
          setStatus('success')
          setPayloadOrderId(data.orderId || '')
        } else {
          setStatus('error')
          setMessage(data.message || '결제 확인 실패')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('서버 오류가 발생했습니다.')
      })
  }, []) // eslint-disable-line

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
          <p className="text-gray-400">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-black text-white">결제 확인 실패</h1>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
          <Link
            href="/cart"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-black"
          >
            장바구니로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/10">
          <CheckCircle className="h-12 w-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black text-white">결제 완료!</h1>
        <p className="mt-2 text-sm text-gray-400">
          결제가 성공적으로 완료되었습니다. 감사합니다!
        </p>
        {payloadOrderId && (
          <p className="mt-2 text-xs text-gray-600">주문번호: {payloadOrderId}</p>
        )}
        <div className="mt-10 flex flex-col gap-3">
          <Link
            href="/my-page"
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-black hover:bg-blue-50 transition-colors"
          >
            <Package className="h-4 w-4" />
            주문 내역 보기
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 py-4 text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            쇼핑 계속하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
