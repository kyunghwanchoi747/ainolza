"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { MagneticText } from "@/components/ui/magnetic-text";
import type { ProductWithDbImages } from "@/lib/products-db";
import { ReviewBanner } from "@/components/landing/review-banner";
import { StoreBanner } from "@/components/store/store-banner";

const TOOLS = [
  { title: "무료 판례 검색 AI", desc: "대법원 판례를 자연어로 검색하고 AI가 핵심을 정리", url: "https://caseai.co.kr/", badge: "웹 서비스", color: "#D4756E", bg: "#FDF3F2" },
  { title: "전세계 실시간 웹사이트 순위", desc: "전 세계에서 떠오르는 웹사이트를 실시간 추적", url: "https://risingsites.com/", badge: "웹 서비스", color: "#7C3AED", bg: "#F5F0FF" },
  { title: "NotebookLM Web Importer", desc: "웹페이지를 NotebookLM으로 한 번에 가져오는 확장", url: "https://chromewebstore.google.com/detail/notebooklm-web-importer-a/pnnlnelknnpdljlkabehdmiapniffdlo?hl=ko&utm_source=ext_sidebar", badge: "Chrome 확장", color: "#10b981", bg: "#F0FDF8" },
  { title: "NotebookLM Bulk Delete", desc: "NotebookLM의 노트를 일괄 삭제하는 확장", url: "https://chromewebstore.google.com/detail/notebooklm-bulk-delete/jbjckccejjhlmcbmkiheicdpajbgdooo?hl=ko&utm_source=ext_sidebar", badge: "Chrome 확장", color: "#3B82F6", bg: "#EFF6FF" },
  { title: "뽀모도로 타이머", desc: "집중·휴식 사이클로 생산성을 높여보세요", url: "/labs/timer.html", badge: "무료 도구", color: "#F59E0B", bg: "#FFFBEB" },
];

const LABS = [
  { href: "/labs/prompt-challenge.html", title: "프롬프트 챌린지", desc: "이미지를 보고 AI처럼 묘사해보세요", tag: "인기", color: "#D4756E", bg: "#D4756E" },
  { href: "/labs/ai-vs-me.html", title: "AI vs 나", desc: "같은 질문, 다른 시각. AI와 비교해보세요", color: "#7C3AED", bg: "#7C3AED" },
  { href: "/labs/prompt-builder.html", title: "프롬프트 빌더", desc: "요소를 조합해서 프롬프트를 만들어보세요", color: "#10b981", bg: "#10b981" },
  { href: "/labs/career-explorer.html", title: "AI 직업 탐색기", desc: "관심사를 입력하면 미래 직업을 추천해줘요", color: "#3B82F6", bg: "#3B82F6" },
  { href: "/labs/ai-word-quiz.html", title: "AI 단어 퀴즈", desc: "AI 용어를 배우면서 두뇌도 훈련!", color: "#F59E0B", bg: "#F59E0B" },
  { href: "/labs/ai-or-human.html", title: "AI일까? 사람일까?", desc: "이 글을 만든 건 누구일까요?", color: "#EC4899", bg: "#EC4899" },
  { href: "/labs/daily-quiz.html", title: "오늘의 AI 퀴즈", desc: "매일 새로운 AI 상식 퀴즈에 도전!", tag: "DAILY", color: "#D4A853", bg: "#D4A853" },
];

interface LandingPageProps {
  products: ProductWithDbImages[];
}

export default function LandingPage({ products }: LandingPageProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI놀자",
    description: "놀면서 배우는 AI 교육 플랫폼",
    url: "https://ainolza.kr",
  };

  return (
    <div className="min-h-screen bg-white text-ink font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. 히어로 */}
      <section className="relative bg-dark-blue text-white pt-20 pb-16 md:pt-28 md:pb-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-brand text-base md:text-lg font-bold mb-5 tracking-wide">
            놀면서 배우는 AI, 만들면서 익히는 AI
          </p>
          <MagneticText
            text={"AI놀자에서\n직접 만나보세요"}
            className="text-4xl md:text-6xl font-extrabold leading-[1.15] mb-7"
            radius={200}
            maxScale={1.25}
            maxLift={-10}
          />
          <p className="text-white/70 text-base md:text-xl mb-10 leading-relaxed">
            제가 직접 만든 도구와 실험실, 그리고 강의로<br />
            평범한 사람도 AI로 결과를 만들 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/store" className="inline-block px-8 py-4 bg-brand text-white font-extrabold rounded-full hover:bg-brand-dark hover:scale-105 active:scale-95 transition-all text-base cursor-pointer shadow-lg">
              강의 / 책 보기
            </Link>
            <Link href="/labs" className="inline-block px-8 py-4 border-2 border-white/50 text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-base cursor-pointer">
              AI 실험실 체험
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 text-white/30 animate-bounce">
          <span className="text-xs tracking-widest">SCROLL</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* 2. FEATURED — 강의/책 슬라이드 */}
      <section className="py-14 md:py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-sub uppercase mb-1">FEATURING</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-ink">강의 / 책</h2>
            </div>
            <Link href="/store" className="text-sm text-brand font-bold hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <StoreBanner items={products.map(p => ({
            slug: p.slug,
            title: p.title,
            shortDescription: p.shortDescription,
            thumbnail: p._dbThumbnailUrl || `/store/${p.slug}/thumbnail.${p.imageExt || 'png'}`,
            category: p.category || '',
            price: p.price,
            priceLabel: p.priceLabel,
          }))} />
        </div>
      </section>

      {/* 3. AI놀자 프로젝트 — 도구 가로 스크롤 */}
      <section className="py-14 md:py-20 px-6 bg-[#fafaf9]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-sub uppercase mb-1">AI놀자 프로젝트</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-ink">추천 도구</h2>
            </div>
            <Link href="/tools" className="text-sm text-brand font-bold hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 가로 스크롤 카드 */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {TOOLS.map((t) => (
              <a
                key={t.url}
                href={t.url}
                target={t.url.startsWith('http') ? '_blank' : undefined}
                rel={t.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group snap-start shrink-0 w-[240px] md:w-[280px] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer"
                style={{ backgroundColor: t.bg }}
              >
                <div className="p-6 h-full flex flex-col">
                  <span className="inline-block px-2.5 py-1 text-[11px] font-bold rounded-full mb-4 w-fit"
                    style={{ backgroundColor: t.color + '20', color: t.color }}>
                    {t.badge}
                  </span>
                  <h3 className="font-extrabold text-base text-ink mb-2 leading-snug group-hover:text-brand transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-body leading-relaxed flex-1">{t.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold" style={{ color: t.color }}>
                    열기 <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI 실험실 — 컬러 카드 그리드 */}
      <section className="py-14 md:py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-sub uppercase mb-1">놀면서 배우는</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-ink">AI 실험실</h2>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/mascot.png" alt="AI놀자 마스코트" width={40} height={40} className="object-contain hidden md:block" />
              <Link href="/labs" className="text-sm text-brand font-bold hover:underline flex items-center gap-1">
                전체 보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {LABS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer aspect-square flex flex-col justify-end p-5"
                style={{ backgroundColor: item.bg }}
              >
                {item.tag && (
                  <span className="absolute top-4 left-4 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/30 text-white tracking-wider">
                    {item.tag}
                  </span>
                )}
                <h3 className="font-extrabold text-white text-base leading-snug mb-1 drop-shadow">{item.title}</h3>
                <p className="text-white/80 text-xs leading-relaxed line-clamp-2">{item.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-white/90 text-xs font-bold group-hover:gap-2 transition-all">
                  시작하기 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 신뢰 (소셜 프루프) */}
      <section className="py-16 px-6 bg-[#fafaf9] border-y border-line">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-sub text-xs uppercase tracking-widest mb-8 font-bold">강연 및 교육 수강생 1,000+명</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 text-body">
            <span className="text-base md:text-lg font-bold">바이브 코딩 클래스</span>
            <span className="text-line">|</span>
            <span className="text-base md:text-lg font-bold">AI 관련 도서 2권 출판</span>
            <span className="text-line">|</span>
            <span className="text-base md:text-lg font-bold">방송 출연</span>
            <span className="text-line">|</span>
            <span className="text-base md:text-lg font-bold">신문사 칼럼</span>
          </div>
        </div>
      </section>

      {/* 6. 수강생 후기 */}
      <ReviewBanner />

      {/* 7. 푸터 CTA */}
      <section className="py-24 md:py-32 px-6 bg-dark-blue text-white text-center">
        <div className="max-w-[700px] mx-auto">
          <p className="text-brand text-sm md:text-base font-bold mb-4 tracking-wide">지금 바로</p>
          <MagneticText text={"AI놀자와 함께\n시작하세요"} className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight" />
          <p className="text-white/70 text-base md:text-lg mb-12">
            도구로 시작하고, 실험실에서 익히고, 강의로 깊이를 더하세요.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/store" className="inline-block px-10 py-5 bg-white text-[#2C3E50] font-extrabold rounded-full hover:bg-[#f0f0f0] hover:scale-105 active:scale-95 transition-all text-base md:text-lg cursor-pointer shadow-lg">
              강의 / 책 보기
            </Link>
            <Link href="/labs" className="inline-block px-10 py-5 border-2 border-white/50 text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-base md:text-lg cursor-pointer">
              실험실 체험
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
