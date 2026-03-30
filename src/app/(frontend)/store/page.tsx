import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '강의/전자책',
  description: 'AI 바이브 코딩부터 수익화 전략까지. 직접 설계한 콘텐츠를 확인하고 구매하세요.',
}

export default function StorePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-[#333]">강의/전자책</h1>
            <p className="text-[#666] mt-2">AI 활용법부터 수익화 전략, 자동화 시스템 구축까지 직접 설계한 콘텐츠를 확인하고 구매할 수 있습니다.</p>
          </div>

          {/* 상품 카드 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/programs/vibe-coding" className="group rounded-xl border border-[#e5e5e5] overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square bg-[#f8f8f8] overflow-hidden">
                <img src="/programs/바이브코딩상세1.png" alt="바이브 코딩 클래스" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#999] mb-1">AI놀자</p>
                <h3 className="font-medium text-[#333] mb-2 line-clamp-2">AI 바이브 코딩 클래스</h3>
                <p className="text-[#D4756E] font-bold">390,000원</p>
                <p className="text-xs text-[#999] line-through">590,000원</p>
              </div>
            </Link>

            <Link href="/store/uncomfortable-ai" className="group rounded-xl border border-[#e5e5e5] overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square bg-[#f8f8f8] overflow-hidden flex items-center justify-center p-4">
                <img src="/books/uncomfortable-ai/cover.png" alt="불편한 AI" className="max-h-full object-contain group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#999] mb-1">전자책 / 종이책</p>
                <h3 className="font-medium text-[#333] mb-2">불편한 AI</h3>
                <p className="text-xs text-[#666] mb-2">평범한 사람을 위한 AI 리터러시</p>
                <p className="text-[#D4756E] font-bold">교보문고 판매 중</p>
              </div>
            </Link>

            <Link href="/store/personal-intelligence" className="group rounded-xl border border-[#e5e5e5] overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square bg-[#f8f8f8] overflow-hidden flex items-center justify-center p-4">
                <img src="/books/personal-intelligence/1.png" alt="퍼스널 인텔리전스" className="max-h-full object-contain group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#999] mb-1">전자책</p>
                <h3 className="font-medium text-[#333] mb-2">퍼스널 인텔리전스</h3>
                <p className="text-xs text-[#666] mb-2">Google Workspace × Gemini 활용서</p>
                <p className="text-[#D4756E] font-bold">교보문고 판매 중</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
