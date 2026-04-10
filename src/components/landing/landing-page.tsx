"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { MagneticText } from "@/components/ui/magnetic-text";
import type { ProductWithDbImages } from "@/lib/products-db";

// 일반 FAQ — 모든 상품/사이트 공통 (강의 한정 X)
const faqItems = [
  {
    q: "AI놀자는 어떤 사이트인가요?",
    a: "평범한 사람을 위한 AI 활용을 돕는 공간입니다. 직접 만든 무료 도구·실험실, 그리고 강의·도서를 제공합니다. 회원가입 없이도 도구와 실험실은 자유롭게 이용할 수 있어요.",
  },
  {
    q: "회원가입 / 로그인은 어떻게 하나요?",
    a: "이메일로 가입하거나 Google 계정으로 즉시 로그인할 수 있습니다. 기존에 아임웹에서 가입하셨던 분은 같은 이메일로 다시 가입하시거나, '비밀번호 찾기'로 새 비밀번호를 설정해 주세요.",
  },
  {
    q: "결제는 어떻게 진행되나요?",
    a: "현재 홈페이지 이전 작업으로 카드 결제는 일시 중단된 상태입니다. 강의·도서 구매를 원하시면 카카오톡 오픈채팅으로 문의해 주세요. 계좌이체로 안내드립니다.",
  },
  {
    q: "환불은 가능한가요?",
    a: "강의는 수강 시작 7일 이내, 진도율 30% 미만인 경우 전액 환불 가능합니다. 자세한 환불 규정은 각 상품 페이지를 참고해 주세요.",
  },
  {
    q: "도구와 실험실은 무료인가요?",
    a: "네, 모두 무료입니다. 캠페인이나 결제 없이 누구나 이용할 수 있습니다.",
  },
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

function formatPrice(p: number): string {
  return p.toLocaleString("ko-KR") + "원";
}

interface LandingPageProps {
  products: ProductWithDbImages[];
}

export default function LandingPage({ products }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // featured 우선 → 없으면 첫 번째 상품
  const featured =
    products.find((p) => p._dbFeatured) || products[0] || null;
  const others = products.filter((p) => p.slug !== featured?.slug).slice(0, 3);

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
      <section className="bg-dark-blue text-white py-24 md:py-40 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p data-reveal="none" className="text-brand text-base md:text-lg font-bold mb-6 tracking-wide">
            놀면서 배우는 AI, 만들면서 익히는 AI
          </p>
          <MagneticText
            text={"AI놀자에서\n직접 만나보세요"}
            className="text-5xl md:text-7xl font-extrabold leading-[1.15] mb-10"
            radius={200}
            maxScale={1.25}
            maxLift={-10}
          />
          <p data-reveal="up" data-reveal-delay="400" className="text-white/80 text-lg md:text-2xl mb-12 leading-relaxed font-medium">
            제가 직접 만든 도구와 실험실, 그리고 강의로<br />
            평범한 사람도 AI로 결과를 만들 수 있습니다.
          </p>
          <div data-reveal="up" data-reveal-delay="600" className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/tools"
              className="inline-block px-10 py-5 bg-white text-[#2C3E50] font-extrabold rounded-full hover:bg-[#f0f0f0] hover:scale-105 active:scale-95 transition-all text-base md:text-lg cursor-pointer shadow-lg"
            >
              도구 둘러보기
            </Link>
            <Link
              href="/labs"
              className="inline-block px-10 py-5 border-2 border-white/50 text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-base md:text-lg cursor-pointer"
            >
              AI 실험실 체험
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 도구 */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div data-reveal>
              <p className="text-brand text-sm md:text-base font-bold mb-3 tracking-wide">
                내가 만든 것들
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">도구</h2>
              <p className="text-body mt-4 text-base md:text-lg">
                직접 기획·개발해 운영 중인 무료 웹 서비스와 Chrome 확장
              </p>
            </div>
            <Link
              href="/tools"
              className="text-sm md:text-base text-brand font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {TOOLS.map((t, idx) => (
              <a
                key={t.url}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal="up" data-reveal-delay={String(idx * 120)} className="group relative block p-7 rounded-2xl border-2 border-line hover:border-[#D4756E]/40 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all bg-white cursor-pointer"
              >
                <div
                  className="absolute left-0 top-7 bottom-7 w-1.5 rounded-r-full"
                  style={{ background: t.color }}
                />
                <div className="pl-4">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="inline-block px-3 py-1 text-xs font-bold rounded-full"
                      style={{ background: `${t.color}15`, color: t.color }}
                    >
                      {t.badge}
                    </span>
                    <ExternalLink className="w-5 h-5 text-sub group-hover:text-brand group-hover:scale-110 transition-all" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-ink mb-2 group-hover:text-brand transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm md:text-base text-body leading-relaxed">{t.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI 실험실 */}
      <section className="py-24 md:py-32 px-6 bg-surface">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div data-reveal>
              <p className="text-brand text-sm md:text-base font-bold mb-3 tracking-wide">
                놀면서 배우는
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">AI 실험실</h2>
              <p className="text-body mt-4 text-base md:text-lg">
                간단한 체험으로 AI의 원리를 직접 느껴보세요
              </p>
            </div>
            <Image
              src="/mascot.png"
              alt="AI놀자 마스코트"
              width={80}
              height={80}
              className="object-contain hidden md:block"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LABS_PREVIEW.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                data-reveal="up" data-reveal-delay={String(idx * 80)} className="group p-7 bg-white rounded-2xl border-2 border-line hover:border-[#D4756E]/40 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-extrabold text-xl">{item.title}</h3>
                  {item.tag && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: item.color + "20", color: item.color }}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>
                <p className="text-body text-sm md:text-base mb-5">{item.desc}</p>
                <span
                  className="text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                  style={{ color: item.color }}
                >
                  시작하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          {/* 오늘의 퀴즈 배너 */}
          <Link
            href="/labs/daily-quiz.html"
            data-reveal className="group block mt-8 p-6 bg-white rounded-2xl border-2 border-line hover:border-[#D4A853]/40 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">&#128218;</span>
                <div>
                  <span className="text-xs text-[#D4A853] font-bold tracking-wide">DAILY</span>
                  <h3 className="font-extrabold text-lg">오늘의 AI 퀴즈</h3>
                </div>
              </div>
              <span className="text-sm md:text-base text-[#D4A853] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                오늘의 문제 풀기 <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. 강의/책 */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div data-reveal className="text-center mb-16">
            <p className="text-brand text-sm md:text-base font-bold mb-3 tracking-wide">
              더 깊이 배우고 싶다면
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">강의 / 책</h2>
            <p className="text-body mt-4 max-w-[600px] mx-auto text-base md:text-lg">
              실험실과 도구를 만들어 본 경험을 그대로 강의에 담았습니다.
            </p>
          </div>

          {/* Featured 큰 카드 */}
          {featured && (
            <Link
              href={`/store/${featured.slug}`}
              data-reveal="up" className="group block max-w-[1000px] mx-auto rounded-3xl overflow-hidden border-2 border-line hover:border-[#D4756E]/50 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all bg-white cursor-pointer mb-10"
            >
              <div className="aspect-[16/10] overflow-hidden bg-surface flex items-center justify-center p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured._dbThumbnailUrl || `/store/${featured.slug}/thumbnail.png`}
                  alt={featured.title}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-brand text-sm md:text-base font-bold mb-2">
                      {featured.category || "강의"}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-extrabold whitespace-pre-line leading-tight mb-3">
                      {featured.title}
                    </h3>
                    {featured.subtitle && (
                      <p className="text-body text-base md:text-lg">{featured.subtitle}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {featured.priceLabel ? (
                      <p className="text-base md:text-lg font-bold text-brand">
                        {featured.priceLabel}
                      </p>
                    ) : featured.price ? (
                      <>
                        <p className="text-2xl md:text-3xl font-extrabold text-brand">
                          {formatPrice(featured.price)}
                        </p>
                        {featured.originalPrice && featured.originalPrice > featured.price && (
                          <p className="text-sm text-sub line-through">
                            {formatPrice(featured.originalPrice)}
                          </p>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-brand font-bold group-hover:gap-3 transition-all">
                  자세히 보기 <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          )}

          {/* 나머지 작은 카드 줄 */}
          {others.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1000px] mx-auto mb-10">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/store/${p.slug}`}
                  className="group rounded-2xl overflow-hidden border-2 border-line hover:border-[#D4756E]/40 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all bg-white cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden bg-surface flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p._dbThumbnailUrl || `/store/${p.slug}/thumbnail.png`}
                      alt={p.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-sub mb-1.5 font-medium">{p.category}</p>
                    <h4 className="font-extrabold text-base text-ink line-clamp-2 whitespace-pre-line leading-snug mb-2">
                      {p.title}
                    </h4>
                    {p.priceLabel ? (
                      <p className="text-brand font-bold text-sm">{p.priceLabel}</p>
                    ) : p.price ? (
                      <p className="text-brand font-extrabold text-base">
                        {formatPrice(p.price)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              href="/store"
              className="inline-block px-8 py-4 border-2 border-[#333] text-ink font-bold rounded-full hover:bg-ink hover:text-white hover:scale-105 active:scale-95 transition-all text-base cursor-pointer"
            >
              모든 강의·책 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 5. 신뢰 (소셜 프루프) */}
      <section className="py-20 px-6 border-y border-line bg-surface">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-sub text-xs md:text-sm uppercase tracking-widest mb-10 font-bold">
            강연 및 교육 수강생 1,000+명
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-body">
            <span className="text-lg md:text-xl font-bold">바이브 코딩 클래스</span>
            <span className="text-lg md:text-xl font-bold">AI 관련 도서 2권 출판</span>
            <span className="text-lg md:text-xl font-bold">방송 출연</span>
            <span className="text-lg md:text-xl font-bold">신문사 칼럼</span>
          </div>
        </div>
      </section>

      {/* 6. FAQ — 일반 질문 */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid md:grid-cols-[260px_1fr] gap-10">
            <div>
              <p className="text-brand text-sm md:text-base font-bold mb-3 tracking-wide">
                자주 묻는 질문
              </p>
              <h2 data-reveal className="text-4xl md:text-5xl font-extrabold leading-tight">FAQ</h2>
              <p className="text-body mt-4 text-base">
                강의별 FAQ는 각 상품 페이지를 참고해 주세요.
              </p>
            </div>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#D4756E]/20 transition-all"
                >
                  <button
                    type="button"
                    className="w-full text-left p-6 flex items-center justify-between cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-brand text-sm font-extrabold">Q</span>
                      <span className="text-base md:text-lg font-bold text-ink">{item.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-sub transition-transform shrink-0 ml-3 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-body text-sm md:text-base leading-relaxed pl-14">
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
      <section className="py-24 md:py-32 px-6 bg-dark-blue text-white text-center">
        <div className="max-w-[700px] mx-auto">
          <p className="text-brand text-sm md:text-base font-bold mb-4 tracking-wide">
            지금 바로
          </p>
          <h2 data-reveal className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            AI놀자와 함께<br />시작하세요
          </h2>
          <p className="text-white/70 text-base md:text-lg mb-12">
            도구로 시작하고, 실험실에서 익히고, 강의로 깊이를 더하세요.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/store"
              className="inline-block px-10 py-5 bg-white text-[#2C3E50] font-extrabold rounded-full hover:bg-[#f0f0f0] hover:scale-105 active:scale-95 transition-all text-base md:text-lg cursor-pointer shadow-lg"
            >
              강의 / 책 보기
            </Link>
            <Link
              href="/labs"
              className="inline-block px-10 py-5 border-2 border-white/50 text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-base md:text-lg cursor-pointer"
            >
              실험실 체험
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
