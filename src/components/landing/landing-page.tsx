"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

const faqItems = [
  { q: "코딩을 전혀 몰라도 수강할 수 있나요?", a: "네, 가능합니다. 이 클래스는 코딩 경험이 전혀 없는 분들을 위해 설계되었습니다. AI가 코드를 작성해주기 때문에 여러분은 기획과 디렉팅에만 집중하면 됩니다." },
  { q: "수강 기간은 얼마나 되나요?", a: "4주 과정으로, 주 1회 라이브 강의와 매일 자습 과제가 제공됩니다. 이후에도 커뮤니티를 통해 지속적으로 지원받을 수 있습니다." },
  { q: "환불은 가능한가요?", a: "수강 시작 7일 이내, 진도율 30% 미만인 경우 전액 환불이 가능합니다. 자세한 내용은 이용약관을 참고해주세요." },
  { q: "전자책만 따로 구매할 수 있나요?", a: "네, 강의/책 페이지에서 별도로 구매하실 수 있습니다. 교보문고에서도 구매 가능합니다." },
  { q: "AI를 처음 접하는데 이해할 수 있을까요?", a: "걱정 마세요. 기초부터 차근차근 알려드립니다. AI 실험실에서 먼저 무료로 체험해보시는 것을 추천드려요." },
];

const TOOLS = [
  {
    title: "무료 판례 검색 AI",
    desc: "대법원 판례를 자연어로 검색하고 AI가 핵심을 정리",
    url: "https://caseai.co.kr/",
    badge: "웹 서비스",
    color: "#D4756E",
  },
  {
    title: "전세계 실시간 웹사이트 순위",
    desc: "전 세계에서 떠오르는 웹사이트를 실시간 추적",
    url: "https://risingsites.com/",
    badge: "웹 서비스",
    color: "#7C3AED",
  },
  {
    title: "NotebookLM Web Importer",
    desc: "웹페이지를 NotebookLM으로 한 번에 가져오는 확장",
    url: "https://chromewebstore.google.com/detail/notebooklm-web-importer-a/pnnlnelknnpdljlkabehdmiapniffdlo?hl=ko&utm_source=ext_sidebar",
    badge: "Chrome 확장",
    color: "#10b981",
  },
  {
    title: "NotebookLM Bulk Delete",
    desc: "NotebookLM의 노트를 일괄 삭제하는 확장",
    url: "https://chromewebstore.google.com/detail/notebooklm-bulk-delete/jbjckccejjhlmcbmkiheicdpajbgdooo?hl=ko&utm_source=ext_sidebar",
    badge: "Chrome 확장",
    color: "#3B82F6",
  },
];

const LABS_PREVIEW = [
  { href: "/labs/prompt-challenge.html", title: "프롬프트 챌린지", desc: "이미지를 보고 AI처럼 묘사해보세요", tag: "인기", color: "#D4756E" },
  { href: "/labs/ai-vs-me.html", title: "AI vs 나", desc: "같은 질문, 다른 시각. AI와 비교해보세요", color: "#7C3AED" },
  { href: "/labs/prompt-builder.html", title: "프롬프트 빌더", desc: "요소를 조합해서 프롬프트를 만들어보세요", color: "#10b981" },
  { href: "/labs/career-explorer.html", title: "AI 직업 탐색기", desc: "관심사를 입력하면 미래 직업을 추천해줘요", color: "#3B82F6" },
  { href: "/labs/ai-word-quiz.html", title: "AI 단어 퀴즈", desc: "AI 용어를 배우면서 두뇌도 훈련!", color: "#F59E0B" },
  { href: "/labs/ai-or-human.html", title: "AI일까? 사람일까?", desc: "이 글을 만든 건 누구일까요?", color: "#EC4899" },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI놀자',
    description: '놀면서 배우는 AI 교육 플랫폼',
    url: 'https://ainolza.kr',
  }

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. 히어로 */}
      <section className="bg-[#2C3E50] text-white py-20 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-[#D4756E] text-lg font-medium mb-6">
            놀면서 배우는 AI, 만들면서 익히는 AI
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
            AI놀자에서<br />직접 만나보세요
          </h1>
          <p className="text-white/70 text-base md:text-lg mb-10 leading-relaxed">
            제가 직접 만든 도구와 실험실, 그리고 강의로<br />
            평범한 사람도 AI로 결과를 만들 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/tools"
              className="px-6 py-3 bg-white text-[#2C3E50] font-bold rounded-full hover:bg-[#f0f0f0] transition-all text-sm"
            >
              도구 둘러보기
            </Link>
            <Link
              href="/labs"
              className="px-6 py-3 border border-white/40 text-white font-medium rounded-full hover:bg-white/10 transition-all text-sm"
            >
              AI 실험실 체험
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 도구 (내가 만든 것들) */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#D4756E] text-sm font-medium mb-2">내가 만든 것들</p>
              <h2 className="text-3xl md:text-4xl font-bold">도구</h2>
              <p className="text-[#666] mt-2">직접 기획·개발해 운영 중인 무료 웹 서비스와 Chrome 확장</p>
            </div>
            <Link href="/tools" className="text-[14px] text-[#D4756E] hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {TOOLS.map((t) => (
              <a
                key={t.url}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block p-6 rounded-2xl border border-[#e5e5e5] hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white"
              >
                <div
                  className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full"
                  style={{ background: t.color }}
                />
                <div className="pl-3">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-block px-2.5 py-1 text-xs font-medium rounded-full"
                      style={{ background: `${t.color}15`, color: t.color }}
                    >
                      {t.badge}
                    </span>
                    <ExternalLink className="w-4 h-4 text-[#999] group-hover:text-[#D4756E] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-[#333] mb-1 group-hover:text-[#D4756E] transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed">{t.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI 실험실 */}
      <section className="py-20 px-6 bg-[#f8f8f8]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#D4756E] text-sm font-medium mb-2">놀면서 배우는</p>
              <h2 className="text-3xl md:text-4xl font-bold">AI 실험실</h2>
              <p className="text-[#666] mt-2">간단한 체험으로 AI의 원리를 직접 느껴보세요</p>
            </div>
            <Image src="/mascot.png" alt="AI놀자 마스코트" width={60} height={60} className="object-contain hidden md:block" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LABS_PREVIEW.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-6 bg-white rounded-xl border border-[#e5e5e5] hover:border-[#D4756E]/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  {item.tag && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: item.color + '20', color: item.color }}>
                      {item.tag}
                    </span>
                  )}
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

      {/* 4. 강의/책 */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#D4756E] text-sm font-medium mb-2">더 깊이 배우고 싶다면</p>
            <h2 className="text-3xl md:text-4xl font-bold">강의 / 책</h2>
            <p className="text-[#666] mt-3 max-w-[600px] mx-auto">
              실험실과 도구를 만들어 본 경험을 그대로 강의에 담았습니다.
              코딩 0인 분도 4주에 자기 사이트를 운영할 수 있습니다.
            </p>
          </div>

          <Link
            href="/store"
            className="group block max-w-[900px] mx-auto rounded-2xl overflow-hidden border border-[#e5e5e5] hover:border-[#D4756E]/50 hover:shadow-lg transition-all"
          >
            <div className="aspect-video overflow-hidden bg-[#f8f8f8]">
              <Image
                src="/programs/바이브코딩상세1.png"
                alt="바이브 코딩 클래스"
                width={1200}
                height={675}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#999] mb-1">강의</p>
                <h3 className="text-lg font-bold">AI 바이브 코딩 클래스</h3>
              </div>
              <span className="text-sm font-medium text-[#D4756E] flex items-center gap-1">
                전체 보기 <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <div className="text-center mt-8">
            <Link
              href="/store"
              className="inline-block px-6 py-3 border border-[#333] text-[#333] font-medium rounded-full hover:bg-[#333] hover:text-white transition-all text-sm"
            >
              모든 강의·책 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 5. 신뢰 (소셜 프루프) */}
      <section className="py-16 px-6 border-y border-[#e5e5e5] bg-[#fafafa]">
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

      {/* 6. FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-3xl font-bold">FAQ</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-[#f8f8f8] rounded-xl overflow-hidden">
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

      {/* 7. 푸터 CTA */}
      <section className="py-20 px-6 bg-[#2C3E50] text-white text-center">
        <div className="max-w-[600px] mx-auto">
          <p className="text-[#D4756E] text-sm font-medium mb-4">지금 바로</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI놀자와 함께 시작하세요
          </h2>
          <p className="text-white/70 text-sm mb-10">
            도구로 시작하고, 실험실에서 익히고, 강의로 깊이를 더하세요.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/store"
              className="inline-block px-8 py-4 bg-white text-[#2C3E50] font-bold rounded-full hover:bg-[#f0f0f0] transition-all text-[15px]"
            >
              강의 / 책 보기
            </Link>
            <Link
              href="/labs"
              className="inline-block px-8 py-4 border border-white/40 text-white font-medium rounded-full hover:bg-white/10 transition-all text-[15px]"
            >
              실험실 체험
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
