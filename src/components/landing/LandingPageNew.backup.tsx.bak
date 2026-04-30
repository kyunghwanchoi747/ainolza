"use client";

import { Fragment } from "react";
import Link from "next/link";
import s from "./landing.module.css";

/* ─── Icons ───────────────────────────────────────────────── */
const Icon = {
  Arrow: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
  Kakao: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.88 5.37 4.7 6.78l-.98 3.6c-.1.38.32.68.66.47L10.62 19.3c.45.04.91.07 1.38.07 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
    </svg>
  ),
  Star: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  ),
  Quote: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M7 7h4v4H9c0 2 1 3 3 3v2c-4 0-5-3-5-5V7zm8 0h4v4h-2c0 2 1 3 3 3v2c-4 0-5-3-5-5V7z" />
    </svg>
  ),
  Spark: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  ),
  Target: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  Users: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M16 14c3 .3 5 2.3 5 5" />
    </svg>
  ),
  Heart: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />
    </svg>
  ),
};

/* ─── Data ────────────────────────────────────────────────── */
const COURSES = [
  { badge: "바이브 코딩", title: "바이브코딩 입문", desc: "코딩 지식 없이도 AI와 대화하며 나만의 웹사이트를 만듭니다. 4주 만에 실제 배포까지.", meta: ["4주 · 주 2회", "온라인 실시간", "왕초보 환영"], price: "390,000", discount: "490,000", hot: false },
  { badge: "ChatGPT", title: "ChatGPT 실전 활용", desc: "이메일, 보고서, 마케팅 글까지. 직장에서 바로 쓰는 프롬프트 30개와 나만의 템플릿.", meta: ["3주 · 주 2회", "온라인 실시간", "직장인 맞춤"], price: "290,000", discount: "350,000", hot: false },
  { badge: "AI 수익화", title: "AI 수익화 클래스", desc: "콘텐츠, 사이드 프로젝트, 자동화까지. AI로 부가수익 만드는 법을 실제 사례로 배웁니다.", meta: ["6주 · 주 1회", "오프라인 포함", "심화 과정"], price: "590,000", discount: "750,000", hot: true },
];

const WHYS = [
  { Ico: Icon.Heart, title: "초보자도 OK", desc: "코딩·AI 경험이 전혀 없어도 괜찮아요. 처음부터 차근차근, 용어도 쉽게 풀어서 설명합니다." },
  { Ico: Icon.Target, title: "실전 중심 커리큘럼", desc: '이론보다 결과물. 첫 주부터 직접 만들어 보면서 "진짜 내 것"으로 익힙니다.' },
  { Ico: Icon.Users, title: "소수 정예 수업", desc: "클래스당 최대 12명. 질문하기 편한 분위기에서 1:1에 가까운 피드백을 받을 수 있어요." },
  { Ico: Icon.Spark, title: "평생 커뮤니티", desc: "강의 끝나도 이어지는 동문 모임과 업데이트. AI는 빠르게 바뀌니까, 학습도 계속 함께." },
];

const REVIEWS = [
  { quote: "처음엔 제가 할 수 있을까 반신반의했는데, 선생님이 진짜 제 속도에 맞춰주셔서 따라갈 수 있었어요. 이제 혼자서도 ChatGPT로 업무 메일을 쓰고 있습니다.", name: "김정희", meta: "54세 · 교사", initial: "김", color: "#D4756E" },
  { quote: '은퇴 후 뭘 해야 할지 막막했는데, 바이브코딩 수업 듣고 제 사업 홈페이지를 직접 만들었어요. 주변에서 놀라워해요, "이걸 네가 만들었다고?"', name: "박성호", meta: "61세 · 자영업", initial: "박", color: "#B8604F" },
  { quote: "소수 정예라 질문을 편하게 할 수 있어서 좋았어요. 내가 뒤처지지 않나 눈치 볼 필요 없이, 모르는 건 그 자리에서 바로 해결하고 넘어가는 방식이 맞았습니다.", name: "이미영", meta: "47세 · 주부", initial: "이", color: "#8C4A3E" },
];

const STATS = [
  { v: "500명+", l: "누적 수강생" },
  { v: "98%", l: "강의 만족도" },
  { v: "12개", l: "누적 강의" },
  { v: "4.8", l: "평균 평점", sub: "/ 5.0" },
];

/* ─── Component ───────────────────────────────────────────── */
export default function LandingPage({ heroVariant = "white" }: { heroVariant?: "white" | "softgray" | "warm" }) {
  return (
    <div className={s.root}>
      {/* HERO */}
      <section className={`${s.hero} ${s[heroVariant] ?? ""}`}>
        <div className={`${s.orb} ${s.orb1}`} />
        <div className={`${s.orb} ${s.orb2}`} />
        <div className={`${s.orb} ${s.orb3}`} />
        <div className={`${s.orb} ${s.orb4}`} />

        <div className={s.heroInner}>
          <span className={s.pill}>
            <span>놀면서 배우는 AI · 만들면서 익히는 AI</span>
          </span>
          <h1 className={s.heroTitle}>
            <span className={s.hoverPop}>AI놀자에서</span><br />
            <span className={s.hoverPop}>직접 만나보세요</span>
          </h1>
          <p className={s.heroLead}>
            직접 만든 도구와 실험실, 그리고 강의로<br />
            평범한 사람도 AI로 결과를 만들 수 있습니다.
          </p>
          <div className={s.ctas}>
            <Link href="/store" className={s.btnCoral}>강의 둘러보기 <Icon.Arrow /></Link>
            <a href="https://open.kakao.com/o/s7kkWTfh" target="_blank" rel="noopener noreferrer" className={s.btnGhost}><Icon.Kakao width={18} height={18} /> 카카오톡 문의</a>
          </div>

          <div className={`${s.browser} ${s.glass} ${s.sheen}`}>
            <div className={s.browserBar}>
              <div className={s.dots}>
                <span style={{ background: "#FF5F57" }} />
                <span style={{ background: "#FEBC2E" }} />
                <span style={{ background: "#28C840" }} />
              </div>
              <span className={s.url}>ainolja.co.kr</span>
              <span className={s.secure}>
                <Icon.Check style={{ color: "#10b981" }} width={12} height={12} /> 보안 연결
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className={s.social}>
        <div className={s.statGrid}>
          {STATS.map((st) => (
            <div key={st.l} className={s.stat}>
              <p className={s.statValue}>
                {st.v}{st.sub && <small>{st.sub}</small>}
              </p>
              <p className={s.statLabel}>{st.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.headingCenter}>
            <p className={s.eyebrow}>Featured Courses</p>
            <h2 className={s.h2}>지금, 가장 많이 찾는 강의</h2>
            <p className={s.sectionLead}>초보자부터 실무자까지, 당신의 수준에 맞춰 시작할 수 있어요.</p>
          </div>
          <div className={s.courseGrid}>
            {COURSES.map((c, i) => (
              <div key={i} className={`${s.courseCard} ${s.glass} ${s.sheen}`}>
                {c.hot && <div className={s.hotBadge}>HOT</div>}
                <div className={s.courseHead}>
                  <span className={s.courseBadge}>{c.badge}</span>
                </div>
                <div className={s.courseBody}>
                  <h3 className={s.courseTitle}>{c.title}</h3>
                  <p className={s.courseDesc}>{c.desc}</p>
                  <div className={s.courseMeta}>
                    {c.meta.map((m, j) => (
                      <div key={j} className={s.metaRow}>
                        <Icon.Check width={14} height={14} /> {m}
                      </div>
                    ))}
                  </div>
                  <div className={s.priceRow}>
                    <div>
                      <p className={s.priceOld}>₩ {c.discount}</p>
                      <p className={s.priceNow}>₩ {c.price}</p>
                    </div>
                    <button className={`${s.btnCoral} ${s.sm}`}>자세히 보기 <Icon.Arrow /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/store" className={s.btnGhost}>전체 강의 보기 <Icon.Arrow /></Link>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className={s.sectionAlt}>
        <div className={s.container}>
          <div className={s.whyHead}>
            <div>
              <p className={s.eyebrow}>Why AI놀자</p>
              <h2 className={s.h2}>왜 많은 분들이<br />AI놀자를 선택할까요?</h2>
            </div>
            <p className={s.whyLead}>
              AI놀자는 교육 콘텐츠 회사가 아닙니다. 7년간 중장년 세대와 함께 직접 현장에서 만들어온,
              <strong> &quot;나도 할 수 있다&quot;</strong>는 경험을 파는 곳입니다.
            </p>
          </div>
          <div className={s.whyGrid}>
            {WHYS.map((w, i) => (
              <div key={i} className={`${s.whyCard} ${s.glass} ${s.sheen}`}>
                <div className={s.whyIcon}><w.Ico /></div>
                <h3 className={s.whyTitle}>{w.title}</h3>
                <p className={s.whyDesc}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.headingCenter}>
            <p className={s.eyebrow}>Real Stories</p>
            <h2 className={s.h2}>먼저 시작한 분들의 이야기</h2>
            <p className={s.sectionLead}>매주 업데이트되는 실제 수강 후기.</p>
          </div>
          <div className={s.reviewGrid}>
            {REVIEWS.map((r, i) => (
              <div key={i} className={`${s.reviewCard} ${s.glass} ${s.sheen}`}>
                <Icon.Quote className={s.reviewQuoteIcon} width={32} height={32} />
                <div className={s.stars}>
                  {[0, 1, 2, 3, 4].map((j) => <Icon.Star key={j} width={14} height={14} />)}
                </div>
                <p className={s.reviewQuote}>&ldquo;{r.quote}&rdquo;</p>
                <div className={s.reviewer}>
                  <div className={s.avatar} style={{ background: r.color }}>{r.initial}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className={s.reviewerName}>{r.name}</p>
                    <p className={s.reviewerMeta}>{r.meta}</p>
                  </div>
                  <span className={s.reviewerTag}>수강 완료</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={s.finalCta}>
        <div className={s.ctaOrb1} />
        <div className={s.ctaOrb2} />
        <div className={s.ctaOrb3} />
        <div className={`${s.ctaBox} ${s.glass} ${s.sheen}`}>
          <p className={s.eyebrow}>지금 시작</p>
          <h2 className={s.ctaTitle}>망설이는 시간이<br />가장 아쉬운 시간입니다.</h2>
          <p className={s.ctaLead}>
            카카오톡으로 편하게 문의해 주세요.<br />
            상담은 무료, 본인에게 맞는 강의를 같이 찾아드립니다.
          </p>
          <div className={s.ctas}>
            <a href="https://open.kakao.com/o/s7kkWTfh" target="_blank" rel="noopener noreferrer" className={s.btnCoral}><Icon.Kakao width={18} height={18} /> 카카오톡으로 무료 상담</a>
            <Link href="/store" className={s.btnGhost}>강의 전체보기</Link>
          </div>
          <p className={s.ctaMeta}>
            평균 응답 시간 <strong>15분 이내</strong> · 평일 09:00–18:00
          </p>
        </div>
      </section>

    </div>
  );
}
