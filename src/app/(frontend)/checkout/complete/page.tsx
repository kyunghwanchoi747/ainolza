'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CompleteContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber') || ''

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="max-w-[500px] text-center">
        <div className="text-6xl mb-6">&#10003;</div>
        <h1 className="text-3xl font-bold text-[#333] mb-4">주문이 완료되었습니다</h1>
        {orderNumber && (
          <p className="text-[#999] text-sm mb-2">주문번호: <span className="font-mono text-[#333]">{orderNumber}</span></p>
        )}
        <p className="text-[#666] text-sm mb-8">
          결제 확인 후 콘텐츠 이용이 가능합니다.<br/>
          문의사항은 카카오톡 오픈채팅으로 연락해주세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/mypage" className="px-6 py-3 bg-[#D4756E] text-white font-bold rounded-xl hover:bg-[#c0625b] transition-all text-sm">
            마이페이지
          </Link>
          <Link href="/" className="px-6 py-3 border border-[#e5e5e5] text-[#333] font-bold rounded-xl hover:bg-[#f8f8f8] transition-all text-sm">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-[#999]">로딩 중...</p></div>}>
      <CompleteContent />
    </Suspense>
  )
}
