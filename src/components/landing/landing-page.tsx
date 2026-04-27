"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, ArrowUpRight } from "lucide-react";
import { MagneticText } from "@/components/ui/magnetic-text";
import type { ProductWithDbImages } from "@/lib/products-db";
import { ReviewBanner } from "@/components/landing/review-banner";
import { StoreBanner } from "@/components/store/store-banner";


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
  { href: "/labs/timer.html", title: "뽀모도로 타이머", desc: "집중·휴식 사이클로 생산성을 높여보세요", tag: "신규", color: "#06b6d4" },
];

const STATS = [
  { value: "1,000+", label: "강연·교육 수강생" },
  { value: "2권", label: "AI 관련 도서 출판" },
  { value: "4종", label: "무료 도구 운영" },
  { value: "7개", label: "AI 실험실 콘텐츠" },
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

      {/* ── 1. 히어로 ── */}
      <section className="relative bg-dark-blue text-white overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 px-6">
        {/* 유기물 Blob 배경 */}
        <div aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        <div className="relative max-w-[900px] mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-brand/40 text-brand text-xs md:text-sm font-bold mb-6 tracking-wider">
            놀면서 배우는 AI · 만들면서 익히는 AI
          </span>
          <MagneticText
            text={"AI놀자에서\n직접 만나보세요"}
            className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight"
            radius={220}
            maxScale={1.2}
            maxLift={-12}
          />
          <p className="text-white/60 text-base md:text-xl mb-12 leading-relaxed max-w-[560px] mx-auto">
            직접 만든 도구와 실험실, 그리고 강의로<br className="hidden md:block" />
            평범한 사람도 AI로 결과를 만들 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-dark-blue font-bold rounded-full hover:bg-brand hover:text-white hover:gap-3 transition-all duration-300 text-sm md:text-base shadow-lg shadow-black/20"
            >
              도구 둘러보기 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white font-bold rounded-full hover:border-white/60 hover:bg-white/10 transition-all duration-300 text-sm md:text-base"
            >
              AI 실험실 체험
            </Link>
          </div>
        </div>

        {/* 스크롤 암시 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25 animate-bounce">
          <span className="text-[10px] tracking-[0.2em] font-bold">SCROLL</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── 2. 숫자 통계 ── */}
      <section className="py-14 md:py-16 px-6 border-b border-line">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-line">
            {STATS.map((s, i) => (
              <div key={i} data-reveal="up" data-reveal-delay={String(i * 80)} className="text-center px-6 py-2">
                <p className="text-3xl md:text-4xl font-extrabold text-ink mb-1">{s.value}</p>
                <p className="text-sm text-sub font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. 도구 ── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div data-reveal>
              <p className="text-brand text-xs md:text-sm font-bold mb-3 tracking-[0.15em] uppercase">
                AI놀자 프로젝트
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-ink">도구</h2>
              <p className="text-body mt-3 text-sm md:text-base max-w-[400px]">
                직접 기획·개발해 운영 중인 무료 웹 서비스와 Chrome 확장
              </p>
            </div>
            <Link
              href="/tools"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-sub hover:text-ink transition-colors"
            >
              전체 보기 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {TOOLS.map((t, idx) => (
              <a
                key={t.url}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal="up"
                data-reveal-delay={String(idx * 100)}
                className="group relative block p-7 rounded-2xl border border-line bg-white hover:border-transparent hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* 호버 시 색상 배경이 스며듦 */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `${t.color}06` }}
                />
                {/* 상단 컬러 바 */}
                <div
                  className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: t.color }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="inline-block px-3 py-1 text-xs font-bold rounded-full"
                      style={{ background: `${t.color}15`, color: t.color }}
                    >
                      {t.badge}
                    </span>
                    <ExternalLink
                      className="w-4 h-4 text-hint group-hover:text-ink transition-colors"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-ink mb-2 leading-snug">
                    {t.title}
                  </h3>
                  <p className="text-sm text-body leading-relaxed">{t.desc}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm font-bold text-sub hover:text-ink transition-colors">
              전체 보기 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. AI 실험실 ── */}
      <section className="py-24 md:py-32 px-6 bg-[#f7f7f8]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div data-reveal>
              <p className="text-brand text-xs md:text-sm font-bold mb-3 tracking-[0.15em] uppercase">
                놀면서 배우는
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-ink">AI 실험실</h2>
              <p className="text-body mt-3 text-sm md:text-base">
                간단한 체험으로 AI의 원리를 직접 느껴보세요
              </p>
            </div>
            <Image
              src="/mascot.png"
              alt="AI놀자 마스코트"
              width={72}
              height={72}
              className="object-contain hidden md:block opacity-90"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LABS_PREVIEW.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                data-reveal="up"
                data-reveal-delay={String(idx * 70)}
                className="group relative block p-6 bg-white rounded-2xl border border-line hover:border-transparent hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* 호버 색상 스며듦 */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `${item.color}07` }}
                />
                {/* 좌측 포인트 선 */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: item.color }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-extrabold text-base md:text-lg text-ink leading-snug pr-2">{item.title}</h3>
                    {item.tag && (
                      <span
                        className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: item.color + "20", color: item.color }}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-body text-sm leading-relaxed mb-5">{item.desc}</p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:gap-1.5"
                    style={{ color: item.color }}
                  >
                    시작하기 <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* 오늘의 퀴즈 */}
          <Link
            href="/labs/daily-quiz.html"
            data-reveal
            className="group flex items-center justify-between mt-4 p-5 md:p-6 bg-white rounded-2xl border border-line hover:border-transparent hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#D4A853]/10 flex items-center justify-center text-2xl shrink-0">
                📖
              </div>
              <div>
                <span className="text-[10px] text-[#D4A853] font-bold tracking-[0.15em] uppercase block mb-0.5">Daily</span>
                <h3 className="font-extrabold text-base text-ink">오늘의 AI 퀴즈</h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D4A853] group-hover:gap-2.5 transition-all duration-300">
              <span className="hidden md:inline">오늘의 문제 풀기</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <div className="mt-8 text-center">
            <Link href="/labs" className="inline-flex items-center gap-1.5 text-sm font-bold text-sub hover:text-ink transition-colors">
              전체 실험실 보기 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. 강의/책 ── */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-10" data-reveal>
            <div>
              <p className="text-brand text-xs md:text-sm font-bold mb-3 tracking-[0.15em] uppercase">더 깊이 배우고 싶다면</p>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-ink">강의 / 책</h2>
            </div>
            <Link href="/store" className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-sub hover:text-ink transition-colors">
              전체 보기 <ArrowUpRight className="w-4 h-4" />
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
          <div className="mt-2 text-center md:hidden">
            <Link href="/store" className="inline-flex items-center gap-1.5 text-sm font-bold text-sub hover:text-ink transition-colors">
              전체 보기 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. 수강생 후기 ── */}
      <ReviewBanner />

      {/* ── 8. 푸터 CTA ── */}
      <section className="relative py-28 md:py-36 px-6 bg-dark-blue text-white text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand/10 blur-[80px]" />
        </div>
        <div className="relative max-w-[640px] mx-auto">
          <p className="text-brand text-xs md:text-sm font-bold mb-5 tracking-[0.2em] uppercase">
            지금 바로
          </p>
          <MagneticText
            text={"AI놀자와 함께\n시작하세요"}
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-[1.1] tracking-tight"
          />
          <p className="text-white/50 text-sm md:text-base mb-12 leading-relaxed">
            도구로 시작하고, 실험실에서 익히고, 강의로 깊이를 더하세요.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-blue font-bold rounded-full hover:bg-brand hover:text-white hover:gap-3 transition-all duration-300 text-sm md:text-base shadow-lg shadow-black/20"
            >
              강의 / 책 보기 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/25 text-white font-bold rounded-full hover:border-white/60 hover:bg-white/10 transition-all duration-300 text-sm md:text-base"
            >
              실험실 체험
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
