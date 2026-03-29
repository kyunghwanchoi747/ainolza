"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqItems = [
  { q: "코딩을 전혀 몰라도 수강할 수 있나요?", a: "네, 가능합니다. 이 클래스는 코딩 경험이 전혀 없는 분들을 위해 설계되었습니다. AI가 코드를 작성해주기 때문에 여러분은 기획과 디렉팅에만 집중하면 됩니다." },
  { q: "수강 기간은 얼마나 되나요?", a: "4주 과정으로, 주 1회 라이브 강의와 매일 자습 과제가 제공됩니다. 이후에도 커뮤니티를 통해 지속적으로 지원받을 수 있습니다." },
  { q: "환불은 가능한가요?", a: "수강 시작 7일 이내, 진도율 30% 미만인 경우 전액 환불이 가능합니다. 자세한 내용은 이용약관을 참고해주세요." },
  { q: "전자책만 따로 구매할 수 있나요?", a: "네, 강의/전자책 페이지에서 전자책만 별도로 구매하실 수 있습니다. 교보문고에서도 구매 가능합니다." },
  { q: "AI를 처음 접하는데 이해할 수 있을까요?", a: "걱정 마세요. 기초부터 차근차근 알려드립니다. AI 실험실에서 먼저 무료로 체험해보시는 것을 추천드려요." },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans">

      {/* 히어로 */}
      <section className="bg-[#2C3E50] text-white py-20 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-[#D4756E] text-lg font-medium mb-6">
            AI로 나만의 수익을 만드는 확실한 방법
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
            지금부터 제가<br />직접 알려드립니다
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-4 leading-relaxed">
            이 과정은 &apos;모두를 위한&apos; 과정이 아닙니다.<br />
            실제로 결과를 만들 사람들만을 위해 설계되었습니다.
          </p>
        </div>
      </section>

      {/* 이런 분께 맞습니다 */}
      <section className="py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-[#f8f8f8] rounded-2xl p-8 md:p-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              이 과정은 이런 분께 꼭 맞습니다
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">&#128221;</div>
                <h3 className="font-bold text-lg mb-2">꾸준히 실습할 수 있는 분</h3>
                <p className="text-[#666] text-sm">이론이 아닌 직접 만들어보는<br/>실전 중심 과정입니다</p>
              </div>
              <div>
                <div className="text-4xl mb-4">&#128187;</div>
                <h3 className="font-bold text-lg mb-2">나만의 콘텐츠를 운영할 분</h3>
                <p className="text-[#666] text-sm">블로그, 웹사이트를 직접 만들고<br/>운영하고 싶은 분</p>
              </div>
              <div>
                <div className="text-4xl mb-4">&#127891;</div>
                <h3 className="font-bold text-lg mb-2">성과 중심 학습자</h3>
                <p className="text-[#666] text-sm">실제 수익이 나는 결과물을<br/>만들고 싶은 분</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 소셜 프루프 */}
      <section className="py-16 px-6 border-y border-[#e5e5e5]">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-[#999] text-sm uppercase tracking-widest mb-8">강연 및 교육 수강생 1,000+명</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-[#999]">
            <span className="text-lg font-medium">바이브 코딩 클래스</span>
            <span className="text-lg font-medium">AI 관련 도서 2권 출판</span>
            <span className="text-lg font-medium">방송 출연</span>
            <span className="text-lg font-medium">신문사 칼럼</span>
          </div>
        </div>
      </section>

      {/* 강의/전자책 미리보기 */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">강의 / 전자책</h2>
              <p className="text-[#666] mt-2">AI 바이브 코딩부터 수익화까지, 직접 설계한 콘텐츠</p>
            </div>
            <Link href="/store" className="text-[14px] text-[#D4756E] hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Link href="/programs/vibe-coding" className="group block rounded-xl overflow-hidden border border-[#e5e5e5] hover:border-[#D4756E]/30 transition-all">
            <div className="aspect-video overflow-hidden">
              <Image
                src="/programs/바이브코딩상세1.png"
                alt="바이브 코딩 클래스"
                width={1200}
                height={675}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* AI 실험실 */}
      <section className="py-20 px-6 bg-[#f8f8f8]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">AI 실험실</h2>
              <p className="text-[#666] mt-2">놀면서 배우는 AI 체험 프로그램</p>
            </div>
            <Image src="/mascot.png" alt="AI놀자 마스코트" width={60} height={60} className="object-contain" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: "/labs/prompt-challenge.html", title: "프롬프트 챌린지", desc: "이미지를 보고 AI처럼 묘사해보세요", tag: "인기", color: "#D4756E" },
              { href: "/labs/ai-vs-me.html", title: "AI vs 나", desc: "같은 질문, 다른 시각. AI와 비교해보세요", color: "#7C3AED" },
              { href: "/labs/prompt-builder.html", title: "프롬프트 빌더", desc: "요소를 조합해서 프롬프트를 만들어보세요", color: "#10b981" },
              { href: "/labs/career-explorer.html", title: "AI 직업 탐색기", desc: "관심사를 입력하면 미래 직업을 추천해줘요", color: "#3B82F6" },
              { href: "/labs/ai-word-quiz.html", title: "AI 단어 퀴즈", desc: "AI 용어를 배우면서 두뇌도 훈련!", color: "#F59E0B" },
              { href: "/labs/ai-or-human.html", title: "AI일까? 사람일까?", desc: "이 글을 만든 건 누구일까요?", color: "#EC4899" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-6 bg-white rounded-xl border border-[#e5e5e5] hover:border-[#D4756E]/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  {item.tag && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: item.color + '20', color: item.color }}>{item.tag}</span>}
                </div>
                <p className="text-[#666] text-sm mb-4">{item.desc}</p>
                <span className="text-sm font-medium flex items-center gap-1" style={{ color: item.color }}>
                  시작하기 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          {/* 오늘의 퀴즈 배너 */}
          <Link href="/labs/daily-quiz.html" className="group block mt-6 p-5 bg-white rounded-xl border border-[#e5e5e5] hover:border-[#D4A853]/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">&#128218;</span>
                <div>
                  <span className="text-[11px] text-[#D4A853] font-bold">DAILY</span>
                  <h3 className="font-bold">오늘의 AI 퀴즈</h3>
                </div>
              </div>
              <span className="text-sm text-[#D4A853] font-medium flex items-center gap-1">
                오늘의 문제 풀기 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 서비스 카드 */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-6">
          <div className="p-8 bg-[#f8f8f8] rounded-2xl">
            <h3 className="text-xl font-bold mb-2">강의 / 전자책</h3>
            <p className="text-[#666] text-sm mb-4">AI 바이브 코딩부터 수익화 전략까지.<br/>직접 설계한 콘텐츠를 확인하고 구매할 수 있습니다.</p>
            <Link href="/store" className="text-sm font-medium text-[#333] border border-[#333] px-4 py-2 rounded-full inline-block hover:bg-[#333] hover:text-white transition-all">
              자세히보기 +
            </Link>
          </div>
          <div className="p-8 bg-[#f8f8f8] rounded-2xl">
            <h3 className="text-xl font-bold mb-2">AI 실험실</h3>
            <p className="text-[#666] text-sm mb-4">AI 프롬프트 챌린지, 두뇌 훈련, 직업 탐색기까지.<br/>놀면서 AI의 원리를 배워보세요.</p>
            <Link href="/labs/prompt-challenge.html" className="text-sm font-medium text-[#333] border border-[#333] px-4 py-2 rounded-full inline-block hover:bg-[#333] hover:text-white transition-all">
              자세히보기 +
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-[#f8f8f8]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-3xl font-bold">FAQ</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden">
                  <button
                    className="w-full text-left p-5 flex items-center justify-between"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[#D4756E] text-sm font-bold">Q</span>
                      <span className="text-[15px]">{item.q}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-[#999] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-[#666] text-sm leading-relaxed pl-12">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#2C3E50] text-white text-center">
        <div className="max-w-[600px] mx-auto">
          <p className="text-[#D4756E] text-sm font-medium mb-4">지금 바로</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">AI놀자와 함께 시작하세요!</h2>
          <Link
            href="/programs/vibe-coding"
            className="inline-block px-8 py-4 bg-white text-[#2C3E50] font-bold rounded-full hover:bg-[#f0f0f0] transition-all text-[15px]"
          >
            CLASS 신청하기
          </Link>
        </div>
      </section>

    </div>
  );
}
