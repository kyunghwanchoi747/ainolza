'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function FailContent() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('code')
  const errorMessage = searchParams.get('message')

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-500/10">
          <span className="text-4xl">✕</span>
        </div>
        <h1 className="text-3xl font-black text-white">결제 실패</h1>
        <p className="mt-3 text-sm text-gray-400">
          {errorMessage || '결제가 취소되거나 실패했습니다.'}
        </p>
        {errorCode && (
          <p className="mt-1 text-xs text-gray-600">오류 코드: {errorCode}</p>
        )}

        <div className="mt-10 flex flex-col gap-3">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-black hover:bg-blue-50 transition-colors"
          >
            장바구니로 돌아가기
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 py-4 text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function FailPage() {
  return (
    <Suspense>
      <FailContent />
    </Suspense>
  )
}
