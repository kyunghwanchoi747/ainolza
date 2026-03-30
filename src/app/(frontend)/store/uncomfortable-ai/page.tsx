import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '불편한 AI - 평범한 사람을 위한 AI 리터러시',
  description: '멈출 수 없는 변화 속 평범한 사람을 위한 AI 리터러시. Now or Never.',
}

export default function UncomfortableAIPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-8 px-6">
        <div className="max-w-[900px] mx-auto">
          <Link href="/store" className="text-sm text-[#999] hover:text-[#333] transition-colors mb-6 inline-block">
            &larr; 강의/전자책
          </Link>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-[#f8f8f8] rounded-xl p-8 flex items-center justify-center">
            <img
              src="/books/uncomfortable-ai/cover.png"
              alt="불편한 AI 표지"
              className="max-h-[500px] object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[#D4756E] text-sm font-medium mb-2">전자책</p>
            <h1 className="text-3xl font-bold text-[#333] mb-2">불편한 AI</h1>
            <p className="text-[#666] text-lg mb-1">Artificial Intelligence</p>
            <p className="text-[#999] text-sm mb-6">멈출 수 없는 변화 속 평범한 사람을 위한 AI 리터러시 | 최경환 지음</p>

            <div className="space-y-4 mb-8 text-sm text-[#666] leading-relaxed">
              <p className="font-medium text-[#333]">Now or Never.</p>
              <p>AI가 불편하신가요? 그 불편함이 정상입니다.</p>
              <p>이 책은 기술 전문가가 아닌, <strong className="text-[#333]">평범한 사람</strong>을 위해 쓰였습니다. AI가 우리 일상과 직업에 어떤 변화를 가져오는지, 그리고 어떻게 준비해야 하는지를 솔직하게 이야기합니다.</p>
              <p>ChatGPT, Gemini, Claude... 수많은 AI 도구가 쏟아지는 지금, 무엇부터 시작해야 할지 모르겠다면 이 책이 첫 걸음이 되어드립니다.</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1 bg-[#f8f8f8] rounded-full text-xs text-[#666]">AI 리터러시</span>
              <span className="px-3 py-1 bg-[#f8f8f8] rounded-full text-xs text-[#666]">입문자 추천</span>
              <span className="px-3 py-1 bg-[#f8f8f8] rounded-full text-xs text-[#666]">ISBN 등록</span>
              <span className="px-3 py-1 bg-[#f8f8f8] rounded-full text-xs text-[#666]">교보문고</span>
            </div>

            <div className="space-y-3">
              <a
                href="https://ainolza.kr/shop_view?idx=10"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-[#D4756E] text-white font-bold rounded-full text-center hover:bg-[#c0625b] transition-all"
              >
                구매하기
              </a>
              <a
                href="https://search.kyobobook.co.kr/search?keyword=%EB%B6%88%ED%8E%B8%ED%95%9C+AI+%EC%B5%9C%EA%B2%BD%ED%99%98"
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

      {/* 이런 분께 추천 */}
      <section className="py-16 px-6 bg-[#f8f8f8]">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#333] mb-8">이런 분께 추천합니다</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <div className="p-5 bg-white rounded-xl">
              <p className="text-[#333] font-medium mb-1">AI가 뭔지는 아는데 뭘 해야 할지 모르겠는 분</p>
              <p className="text-[#999] text-sm">막연한 불안감을 구체적인 행동으로 바꿔드립니다</p>
            </div>
            <div className="p-5 bg-white rounded-xl">
              <p className="text-[#333] font-medium mb-1">ChatGPT 써봤는데 &apos;그래서 뭐?&apos; 싶은 분</p>
              <p className="text-[#999] text-sm">도구를 넘어 AI 시대의 사고방식을 알려드립니다</p>
            </div>
            <div className="p-5 bg-white rounded-xl">
              <p className="text-[#333] font-medium mb-1">자녀/학생에게 AI를 알려주고 싶은 분</p>
              <p className="text-[#999] text-sm">비전문가도 이해할 수 있는 언어로 쓰였습니다</p>
            </div>
            <div className="p-5 bg-white rounded-xl">
              <p className="text-[#333] font-medium mb-1">AI 시대에 뒤처지고 싶지 않은 분</p>
              <p className="text-[#999] text-sm">지금이 시작하기 가장 좋은 때입니다</p>
            </div>
          </div>
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
            <Link href="/store/personal-intelligence" className="px-6 py-3 border border-[#e5e5e5] rounded-full text-sm font-medium text-[#333] hover:bg-[#f8f8f8] transition-all">
              퍼스널 인텔리전스
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
