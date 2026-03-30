import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '퍼스널 인텔리전스 - Google Workspace × Gemini 활용서',
  description: 'AI 시대, 당신은 AI 격차의 어느 쪽에 있습니까? Google Workspace와 Gemini를 활용한 실용주의 AI 가이드.',
}

export default function PersonalIntelligencePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 상단 */}
      <section className="pt-16 pb-8 px-6">
        <div className="max-w-[900px] mx-auto">
          <Link href="/store" className="text-sm text-[#999] hover:text-[#333] transition-colors mb-6 inline-block">
            &larr; 강의/전자책
          </Link>
        </div>
      </section>

      {/* 상품 정보 */}
      <section className="px-6 pb-12">
        <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-10">
          {/* 표지 */}
          <div className="bg-[#f8f8f8] rounded-xl p-8 flex items-center justify-center">
            <img
              src="/books/personal-intelligence/1.png"
              alt="퍼스널 인텔리전스 표지"
              className="max-h-[500px] object-contain"
            />
          </div>

          {/* 정보 패널 */}
          <div className="flex flex-col justify-center">
            <p className="text-[#D4756E] text-sm font-medium mb-2">전자책 / 종이책</p>
            <h1 className="text-3xl font-bold text-[#333] mb-2">퍼스널 인텔리전스</h1>
            <p className="text-[#666] text-lg mb-1">Personal Intelligence</p>
            <p className="text-[#999] text-sm mb-6">Google Workspace × Gemini 활용서 | 최경환 지음</p>

            <div className="space-y-3 mb-8 text-sm text-[#666] leading-relaxed">
              <p>AI 시대, 당신은 &apos;AI 격차(AI DIVIDE)&apos;의 어느 쪽에 있습니까?</p>
              <p>이 책은 &apos;이론서&apos;가 아니라 &apos;실전서&apos;입니다. 일하자에게 &apos;실용주의&apos;를 표방합니다.</p>
              <p>Google Workspace와 Gemini를 활용하여 업무 자동화, 데이터 분석, AI 시스템 구축까지 실전 스킬을 다룹니다.</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1 bg-[#f8f8f8] rounded-full text-xs text-[#666]">Google Workspace</span>
              <span className="px-3 py-1 bg-[#f8f8f8] rounded-full text-xs text-[#666]">Gemini</span>
              <span className="px-3 py-1 bg-[#f8f8f8] rounded-full text-xs text-[#666]">업무 자동화</span>
              <span className="px-3 py-1 bg-[#f8f8f8] rounded-full text-xs text-[#666]">AI 활용</span>
              <span className="px-3 py-1 bg-[#f8f8f8] rounded-full text-xs text-[#666]">ISBN 등록</span>
            </div>

            <div className="space-y-3">
              <a
                href="https://ainolza.kr/shop_view?idx=21"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-[#D4756E] text-white font-bold rounded-full text-center hover:bg-[#c0625b] transition-all"
              >
                구매하기
              </a>
              <a
                href="https://search.kyobobook.co.kr/search?keyword=%ED%8D%BC%EC%8A%A4%EB%84%90+%EC%9D%B8%ED%85%94%EB%A6%AC%EC%A0%84%EC%8A%A4+%EC%B5%9C%EA%B2%BD%ED%99%98"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 border border-[#333] text-[#333] font-bold rounded-full text-center hover:bg-[#333] hover:text-white transition-all"
              >
                교보문고에서 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 상세 이미지 */}
      <section className="py-12 px-6 bg-[#f8f8f8]">
        <div className="max-w-[700px] mx-auto space-y-2">
          {[2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <img
              key={n}
              src={`/books/personal-intelligence/${n}.png`}
              alt={`퍼스널 인텔리전스 상세 ${n}`}
              className="w-full"
              loading="lazy"
            />
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-[500px] mx-auto">
          <p className="text-[#999] text-sm mb-4">AI놀자의 다른 콘텐츠도 확인해보세요</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/store" className="px-6 py-3 border border-[#e5e5e5] rounded-full text-sm font-medium text-[#333] hover:bg-[#f8f8f8] transition-all">
              강의/전자책 전체보기
            </Link>
            <Link href="/programs/vibe-coding" className="px-6 py-3 bg-[#D4756E] text-white rounded-full text-sm font-medium hover:bg-[#c0625b] transition-all">
              바이브 코딩 클래스
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
