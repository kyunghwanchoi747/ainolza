'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState, Fragment } from 'react'
import Link from 'next/link'
import './landing-v3.css'

const KAKAO_OPEN_CHAT = 'https://open.kakao.com/o/s7kkWTfh'

const COURSES = [
  {
    href: '/store/vibe-coding-101',
    bg: '/landing-v3/course-vibe-101.png',
    badge: '바이브 코딩 [입문]',
    title: '자동 웹사이트 구축 실전',
    desc: '코딩 지식 없이도 나만의 웹사이트를 만듭니다. 2주 만에 실제 사이트 개설 후 배포까지.',
    meta: ['2주 · 주 1회', '온라인 실시간', '왕초보 환영'],
    priceOld: '120,000',
    price: '69,800',
    hot: false,
  },
  {
    href: '/store/vibe-coding-advanced',
    bg: '/landing-v3/course-vibe-advanced.png',
    badge: '바이브 코딩 [심화]',
    title: '백지 위의 바이브코더',
    desc: '웹사이트, 자동화 도구, 나만의 SaaS 제작 나만의 AI 서비스 만들기',
    meta: ['4주 · 주 1회', '온라인 실시간', '직장인 맞춤'],
    priceOld: '350,000',
    price: '298,000',
    hot: false,
  },
  {
    href: '/store',
    bg: '/landing-v3/course-business.png',
    badge: '온라인 비즈니스',
    title: '온라인 수익화 클래스',
    desc: 'AI시대 나에게 알맞는 온라인 수익화 방법. 아무나 받지 않습니다. 인터뷰 진행 후 결제.',
    meta: ['12주 · 주 1회', '온·오프라인 포함', '잔소리 심함, 각오된 사람만'],
    priceOld: '',
    price: '5,000,000~',
    hot: true,
  },
]

const TOOL_ICONS: ReactNode[] = [
  // 1. 무료 판례 검색 AI — 저울 아이콘
  <svg key="0" viewBox="0 0 120 120" width="100%" height="100%" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="60" y1="22" x2="60" y2="92" />
    <line x1="42" y1="92" x2="78" y2="92" />
    <circle cx="60" cy="22" r="3.5" fill="rgba(255,255,255,0.96)" />
    <line x1="22" y1="32" x2="98" y2="32" />
    <path d="M22 32 L12 60 Q22 70 32 60 Z" fill="rgba(255,255,255,0.25)" />
    <path d="M98 32 L88 60 Q98 70 108 60 Z" fill="rgba(255,255,255,0.25)" />
  </svg>,
  // 2. 전세계 실시간 웹사이트 순위 — 차트 아이콘
  <svg key="1" viewBox="0 0 120 120" width="100%" height="100%" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="18" y="22" width="84" height="76" rx="10" fill="rgba(255,255,255,0.18)" />
    <line x1="30" y1="86" x2="30" y2="78" />
    <line x1="46" y1="86" x2="46" y2="62" />
    <line x1="62" y1="86" x2="62" y2="50" />
    <line x1="78" y1="86" x2="78" y2="42" />
    <line x1="94" y1="86" x2="94" y2="34" />
    <polyline points="30,72 46,58 62,46 78,40 94,34" strokeWidth={4} />
    <circle cx="94" cy="34" r="4" fill="rgba(255,255,255,0.96)" />
  </svg>,
  // 3. NotebookLM Web Importer — 노트북 아이콘
  <svg key="2" viewBox="0 0 120 120" width="100%" height="100%" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="28" y="20" width="64" height="84" rx="6" fill="rgba(255,255,255,0.22)" />
    <line x1="40" y1="20" x2="40" y2="104" />
    <line x1="50" y1="40" x2="82" y2="40" />
    <line x1="50" y1="56" x2="82" y2="56" />
    <line x1="50" y1="72" x2="74" y2="72" />
    <path d="M22 28 Q22 22 28 22 L28 102 Q22 102 22 96 Z" fill="rgba(255,255,255,0.35)" />
  </svg>,
  // 4. NotebookLM Bulk Delete — 휴지통 아이콘
  <svg key="3" viewBox="0 0 120 120" width="100%" height="100%" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 36 L34 102 Q34 108 40 108 L80 108 Q86 108 86 102 L90 36" fill="rgba(255,255,255,0.22)" />
    <line x1="22" y1="36" x2="98" y2="36" />
    <path d="M48 28 L48 22 Q48 18 52 18 L68 18 Q72 18 72 22 L72 28" />
    <line x1="50" y1="54" x2="50" y2="92" />
    <line x1="60" y1="54" x2="60" y2="92" />
    <line x1="70" y1="54" x2="70" y2="92" />
  </svg>,
]

const TOOLS = [
  { tag: '웹 서비스', tagClass: 'web', name: '무료 판례 검색 AI', desc: '대법원 판례를 자연어로 검색하고 AI가 핵심을 정리', href: 'https://caseai.co.kr/' },
  { tag: '웹 서비스', tagClass: 'web', name: '전세계 실시간 웹사이트 순위', desc: '전 세계에서 떠오르는 웹사이트를 실시간 추적', href: 'https://risingsites.com/' },
  {
    tag: 'Chrome 확장',
    tagClass: 'chrome',
    name: 'NotebookLM Web Importer',
    desc: '웹페이지를 NotebookLM으로 한 번에 가져오는 확장',
    href: 'https://chromewebstore.google.com/detail/NotebookLM%20Web%20Importer%20%28AI%20Nolza%29/pnnlnelknnpdljlkabehdmiapniffdlo?hl=ko&utm_source=ext_sidebar',
    badge: '⭐ 5.0 · 3,000+ 사용자',
  },
  {
    tag: 'Chrome 확장',
    tagClass: 'chrome-blue',
    name: 'NotebookLM Bulk Delete',
    desc: 'NotebookLM의 노트를 일괄 삭제하는 확장',
    href: 'https://chromewebstore.google.com/detail/notebooklm-bulk-delete/jbjckccejjhlmcbmkiheicdpajbgdooo?hl=ko&utm_source=ext_sidebar',
  },
]

const LABS = [
  { href: '/labs/prompt-challenge.html', color: '#F59E42', label: '프롬프트\n챌린지', r: 0, c: 0 },
  { href: '/labs/ai-vs-me.html',          color: '#E76F51', label: 'AI vs 나',        r: 0, c: 1 },
  { href: '/labs/prompt-builder.html',    color: '#F4A6C0', label: '프롬프트\n빌더',   r: 0, c: 2 },
  { href: '/labs/career-explorer.html',   color: '#7DBF7C', label: 'AI 직업\n탐색기',  r: 1, c: 0 },
  { href: '/labs/ai-word-quiz.html',      color: '#A8D5E5', label: 'AI 단어\n퀴즈',    r: 1, c: 1 },
  { href: '/labs/ai-or-human.html',       color: '#5BA9D9', label: 'AI일까?\n사람일까?', r: 1, c: 2 },
  { href: '/labs/timer.html',             color: '#A89A6E', label: '뽀모도로\n타이머',   r: 2, c: 0 },
  { href: '/labs',                        color: '#8C5E3A', label: '전체\n보기 →',    r: 2, c: 1, more: true },
  { href: '/labs',                        color: '#F4D74A', label: '곧 출시\n예정',    r: 2, c: 2 },
]

const WHYS = [
  { theme: 'coral', title: '초보자도 OK', desc: '코딩·AI 경험이 전혀 없어도 괜찮아요. 처음부터 차근차근, 용어도 쉽게 풀어서 설명합니다.',
    icon: <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/></svg> },
  { theme: 'sunset', title: '실전 중심 커리큘럼', desc: '이론보다 결과물. 첫 주부터 직접 만들어 보면서 "진짜 내 것"으로 익힙니다.',
    icon: <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg> },
  { theme: 'mint', title: '라이브 & 녹화본 동시 제공', desc: '온라인 라이브 진행 후 녹화본 다시보기로 언제든 원하는 시간에 복습이 가능합니다.',
    icon: <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="7" r="2.5"/><path d="M16 14c3 .3 5 2.3 5 5"/></svg> },
  { theme: 'ocean', title: '커뮤니티', desc: '수강생 전용 단톡방 운영. 공식 수강 기간이 끝난 뒤에도 운영됩니다.',
    icon: <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg> },
]

const REVIEWS = [
  {
    quote: '바이브 코딩 입문을 수강한 후 신세계를 경험해 보았습니다. 내 웹 사이트 만들고, 아 이거다 싶어 지금은 바이브 코딩 심화 수강중입니다. 무엇보다 강사님에 교육 철학 과정이 좋았습니다. 처음 접하시는분들은 제가 왜 이말을 하게 되는지 알게 되실겁니다.!!',
    name: '염**', meta: 'tip-pick.com', initial: '염', color: '#6366F1', siteUrl: 'https://tip-pick.com/',
  },
  {
    quote: '바이브 코딩 강의 최강자',
    name: 'N**', meta: 'caseai.co.kr', initial: 'N', color: '#7C3AED', siteUrl: 'https://caseai.co.kr/',
  },
]

const Icons = {
  Arrow: () => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>),
  Chevron: () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>),
  Check: () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6"/></svg>),
  Ext: () => (<svg className="toolExtIcon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6"/><path d="M10 14L20 4"/><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>),
  Star: () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>),
  Kakao: () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.88 5.37 4.7 6.78l-.98 3.6c-.1.38.32.68.66.47L10.62 19.3c.45.04.91.07 1.38.07 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z"/></svg>),
}

const LAB_ICONS: Record<number, ReactNode> = {
  0: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="1.5" fill="currentColor"/><path d="M21 16l-5-5-9 9"/></svg>,
  1: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><rect x="16" y="5" width="6" height="14" rx="1.5"/><circle cx="19" cy="9" r="0.8" fill="currentColor"/></svg>,
  2: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="7" height="6" rx="1.5"/><rect x="14" y="4" width="7" height="6" rx="1.5"/><rect x="3" y="14" width="7" height="6" rx="1.5"/><rect x="14" y="14" width="7" height="6" rx="1.5"/><path d="M10 7h4M10 17h4M6.5 10v4M17.5 10v4"/></svg>,
  3: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/><path d="M11 13v2h2v-2"/></svg>,
  4: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h7M9 11h5"/></svg>,
  5: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01"/><path d="M8 16c1.5-1 6.5-1 8 0"/></svg>,
  6: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6"/><path d="M19 5l1.5-1.5"/></svg>,
  7: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>,
  8: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/><circle cx="12" cy="12" r="9"/></svg>,
}

export default function LandingPageV3() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const counter1 = useRef<HTMLSpanElement>(null)
  const counter2 = useRef<HTMLSpanElement>(null)
  const counter3 = useRef<HTMLSpanElement>(null)
  const isPausedRef = useRef(false)

  // Social Proof Carousel
  useEffect(() => {
    const SLIDES = 6
    const SLIDE_MS = 4500
    const BOOK_MS = 3000
    let timer: ReturnType<typeof setTimeout> | null = null
    function schedule(idx: number) {
      const isBook = idx >= 3
      timer = setTimeout(() => {
        if (!isPausedRef.current) {
          setCurrentSlide((c) => (c + 1) % SLIDES)
        } else {
          schedule(idx)
        }
      }, isBook ? BOOK_MS : SLIDE_MS)
    }
    schedule(currentSlide)
    return () => { if (timer) clearTimeout(timer) }
  }, [currentSlide])

  useEffect(() => {
    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3) }
    function up(el: HTMLSpanElement | null, from: number, to: number, dur: number, fmt?: (v: number) => string) {
      if (!el) return
      const start = performance.now()
      function tick(now: number) {
        const t = Math.min(1, (now - start) / dur)
        const v = from + (to - from) * easeOut(t)
        if (el) el.textContent = fmt ? fmt(v) : Math.round(v).toLocaleString()
        if (t < 1) requestAnimationFrame(tick)
        else if (el) el.textContent = fmt ? fmt(to) : to.toLocaleString()
      }
      requestAnimationFrame(tick)
    }
    if (currentSlide === 0) up(counter1.current, 0, 1000, 2200)
    else if (currentSlide === 1) up(counter2.current, 0, 98, 1800)
    else if (currentSlide === 2) up(counter3.current, 0, 4.8, 1800, (v) => v.toFixed(1))
  }, [currentSlide])

  return (
    <div className="landingV3Root">
      {/* HEADER (fixed dark pill) */}
      <header className="header">
        <div className="headerInner">
          <Link className="logo" href="/">AI놀자</Link>
          <nav className="nav">
            <Link href="/store">강의/책</Link>
            <Link href="/labs">AI실험실</Link>
            <Link href="/tools">도구</Link>
            <Link href="/contact">문의</Link>
          </nav>
          <div className="headerRight">
            <Link className="loginLink" href="/login">로그인</Link>
            <span className="headerDivider"></span>
            <Link className="signupLink" href="/signup">회원가입</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
        <div className="orb orb4"></div>
        <div className="heroGrid">
          <div className="heroCopy">
            <span className="pill" style={{ color: 'rgb(250,128,114)', fontSize: 17 }}>
              <span style={{ color: 'rgb(255,93,93)', fontSize: 18 }}>놀면서 배우는 AI · 만들면서 익히는 AI</span>
            </span>
            <h1 className="heroTitle">
              {Array.from('AI놀자에서').map((c, i) => <span key={`a${i}`} className="hoverPop">{c}</span>)}<br/>
              {Array.from('직접 만나보세요').map((c, i) => <span key={`b${i}`} className="hoverPop">{c}</span>)}
            </h1>
            <p className="heroLead" style={{ width: '100%', maxWidth: 697 }}>
              직접 만든 도구와 실험실, 그리고 강의로<br/>
              평범한 사람도 AI로 결과를 만들 수 있습니다.
            </p>
            <div className="ctas">
              <Link href="/tools" className="btnCoral">도구 둘러보기 <Icons.Arrow /></Link>
              <Link href="/labs" className="btnGhost">AI 실험실 체험</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF carousel */}
      <section className="social">
        <div className="socialStage" onMouseEnter={() => { isPausedRef.current = true }} onMouseLeave={() => { isPausedRef.current = false }}>
          <div className={`socialSlide${currentSlide === 0 ? ' active' : ''}`}>
            <div className="slideStack" style={{ gap: 36, alignItems: 'center', textAlign: 'center' }}>
              <div className="bigNum"><span ref={counter1}>0</span><small>+</small></div>
              <div className="slideLabel" style={{ width: '100%', maxWidth: 520 }}><strong>1,000명 이상</strong>의 수강생이 AI놀자와 함께했습니다</div>
            </div>
          </div>
          <div className={`socialSlide${currentSlide === 1 ? ' active' : ''}`}>
            <div className="slideStack" style={{ gap: 36, alignItems: 'center', textAlign: 'center' }}>
              <div className="bigNum"><span ref={counter2}>0</span><small>%</small></div>
              <div className="slideLabel" style={{ width: '100%', maxWidth: 320 }}>강의 만족도</div>
            </div>
          </div>
          <div className={`socialSlide${currentSlide === 2 ? ' active' : ''}`}>
            <div className="slideStack" style={{ gap: 24, alignItems: 'center', textAlign: 'center' }}>
              <div className="stars-big" style={{ letterSpacing: '3.9px' }}>★ ★ ★ ★ ★</div>
              <div className="bigNum"><span ref={counter3}>0.0</span><small>/ 5.0</small></div>
              <div className="slideLabel" style={{ width: '100%', maxWidth: 320 }}>만족도 평점</div>
            </div>
          </div>
          <div className={`socialSlide bookSlide${currentSlide === 3 ? ' active' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bookCover" src="/landing-v3/book-uneasy-ai.png" alt="불편한 AI" />
            <div className="slideStack">
              <span className="bookTag">저서</span>
              <div className="bookTitle">『불편한 AI』</div>
              <p className="bookDesc"><strong>AI 리터러시</strong>를 기르기 위한<br/>입문자를 위한 서적</p>
            </div>
          </div>
          <div className={`socialSlide bookSlide${currentSlide === 4 ? ' active' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bookCover" src="/landing-v3/book-personal-intelligence.png" alt="퍼스널 인텔리전스" />
            <div className="slideStack">
              <span className="bookTag">2026 신간</span>
              <div className="bookTitle">『퍼스널 인텔리전스』</div>
              <p className="bookDesc"><strong>구글 워크스페이스</strong>를<br/>제대로 활용하는 방법</p>
            </div>
          </div>
          {/* Slide 6: NotebookLM Web Importer */}
          <div className={`socialSlide${currentSlide === 5 ? ' active' : ''}`}>
            <div className="slideStack" style={{ gap: 24, alignItems: 'center', textAlign: 'center' }}>
              <div className="stars-big" style={{ letterSpacing: '3.9px' }}>★ ★ ★ ★ ★</div>
              <div className="bigNum">3,000<small>+</small></div>
              <div className="slideLabel" style={{ width: '100%', maxWidth: 540 }}>
                <strong>NotebookLM Web Importer</strong> · ⭐ 5.0 평점 · 3,000명 이상 사용 중
              </div>
            </div>
          </div>
        </div>
        <div className="socialDots">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <button key={i} type="button" className={`socialDot${currentSlide === i ? ' active' : ''}`} onClick={() => setCurrentSlide(i)} aria-label={`슬라이드 ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* AINOLZA PROJECT (TOOLS) */}
      <section className="section">
        <div className="container">
          <div className="sectionHeadRow">
            <div className="exhibitionHead">
              <h2 className="exhibitionTitle">AINOLZA PROJECT</h2>
              <p className="exhibitionLead">직접 기획·개발해 운영 중인 무료 웹 서비스와 Chrome 확장 프로그램입니다.</p>
            </div>
            <Link href="/labs" className="seeAll">전체 보기 <Icons.Chevron /></Link>
          </div>
          <div className="toolGrid">
            {TOOLS.map((t, i) => {
              const Inner = (
                <>
                  <div className="toolTopRow">
                    <span className={`toolTag ${t.tagClass}`}>{t.tag}</span>
                    <Icons.Ext />
                  </div>
                  <div className="toolVisual">
                    {TOOL_ICONS[i]}
                  </div>
                  <div className="toolCaption">
                    <h3 className="toolName">{t.name}</h3>
                    <p className="toolDesc">{t.desc}</p>
                    {t.badge && (
                      <p style={{
                        marginTop: 10,
                        fontSize: 12,
                        fontWeight: 800,
                        color: 'var(--brand-dark)',
                        background: 'rgba(99,102,241,0.1)',
                        padding: '5px 10px',
                        borderRadius: 9999,
                        display: 'inline-block',
                        letterSpacing: '-0.01em',
                      }}>
                        {t.badge}
                      </p>
                    )}
                  </div>
                </>
              )
              return (
                <a key={i} className="toolCard sheen" href={t.href} target="_blank" rel="noopener noreferrer">{Inner}</a>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI LAB - 퍼즐 그리드 */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="aiLabHero">
            <div className="aiLabCopy">
              <p className="aiLabEyebrow"><span className="aiLabEyebrowLine"></span> AI NOLZA · LAB</p>
              <h2 className="aiLabTitle"><span className="grad">놀면서 배우는</span><br/>AI 실험실</h2>
              <p className="aiLabLead">간단한 체험으로 AI의 원리를 직접 느껴보세요.<br/>한 번의 클릭으로 시작하는 7가지 실험.</p>
              <div style={{ marginTop: 28 }}>
                <Link className="btnGhost" href="/labs">실험실 전체 보기 <Icons.Arrow /></Link>
              </div>
            </div>
            <div className="puzzleGrid">
              {LABS.map((l, i) => (
                <a
                  key={i}
                  className={`puzzlePiece${l.more ? ' more' : ''}`}
                  href={l.href}
                  style={{ ['--pcolor' as any]: l.color }}
                  data-r={l.r}
                  data-c={l.c}
                  aria-label={l.label.replace('\n', ' ')}
                >
                  <span className="puzzleEmoji">{LAB_ICONS[i]}</span>
                  <span className="puzzleLabel">{l.label.split('\n').map((part, j) => (
                    <Fragment key={j}>{j > 0 && <br />}{part}</Fragment>
                  ))}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="headingCenter">
            <p className="eyebrow"></p>
            <h2 className="h2">CLASS</h2>
            <p className="sectionLead">초보자부터 실무자까지, 수준에 맞춰 시작할 수 있는 인기 강의</p>
          </div>
          <div className="courseGrid">
            {COURSES.map((c, i) => (
              <div key={i} className="courseCard glass sheen">
                {c.hot && <div className="hotBadge">HOT</div>}
                <div className="courseHead" style={{ background: `url('${c.bg}') center/cover no-repeat` }}>
                  <span className="courseBadge">{c.badge}</span>
                </div>
                <div className="courseBody">
                  <h3 className="courseTitle">{c.title}</h3>
                  <p className="courseDesc">{c.desc}</p>
                  <div className="courseMeta">
                    {c.meta.map((m, j) => (
                      <div key={j} className="metaRow"><Icons.Check /> {m}</div>
                    ))}
                  </div>
                  <div className="priceRow">
                    <div>
                      {c.priceOld && <p className="priceOld">₩ {c.priceOld}</p>}
                      <p className="priceNow">₩ {c.price}</p>
                    </div>
                    <Link href={c.href} className="btnCoral sm">자세히 보기 <Icons.Arrow /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link href="/store" className="btnGhost">전체 강의 보기 <Icons.Arrow /></Link>
          </div>
        </div>
      </section>

      {/* WHY (다크 섹션) */}
      <section className="sectionAlt" style={{ padding: '38px 24px 101px' }}>
        <div className="container">
          <div className="whyHead">
            <div>
              <p className="eyebrow">AI놀자를 선택하는 이유</p>
              <h2 className="h2">차별점</h2>
            </div>
            <p className="whyLead" style={{ fontSize: 21, fontWeight: 500, letterSpacing: '0.2px', lineHeight: 1.55 }}>
              AI놀자는 단순한 교육 콘텐츠 회사가 아닙니다.<br/>
              중장년 세대와 함께 직접 현장에서 만들어온<br/>
              <strong>&ldquo;나도 할 수 있다&rdquo;</strong>는 경험을 파는 곳입니다.
            </p>
          </div>
          <div className="whyGrid">
            {WHYS.map((w, i) => (
              <div key={i} className="whyCard glass sheen">
                <div className="whyIcon" data-theme={w.theme}>{w.icon}</div>
                <h3 className="whyTitle">{w.title}</h3>
                <p className="whyDesc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (다크 섹션) */}
      <section className="section" style={{ padding: '35px 24px 120px' }}>
        <div className="container">
          <div className="headingCenter">
            <p className="eyebrow">REAL STORIES</p>
            <h2 className="h2">수강생들의 생생한 후기</h2>
          </div>
          <div className="reviewSlider">
            <div className="reviewViewport">
              <div className="reviewTrack" style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                {REVIEWS.map((r, i) => (
                  <div key={i} className="reviewCard glass sheen" style={{ flex: '0 0 calc((100% - 48px) / 3)', minWidth: 320, maxWidth: 380 }}>
                    <div className="stars">
                      {[0, 1, 2, 3, 4].map((j) => <Icons.Star key={j} />)}
                    </div>
                    <p className="reviewQuote">&ldquo;{r.quote}&rdquo;</p>
                    <div className="reviewer">
                      <div className="avatar" style={{ background: r.color }}>{r.initial}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p className="reviewerName">{r.name}</p>
                        <p className="reviewerMeta">{r.meta}</p>
                      </div>
                      <a href={r.siteUrl} target="_blank" rel="noopener noreferrer" className="reviewerTag" style={{ textDecoration: 'none' }}>사이트 보기 →</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="finalCta" style={{ padding: '37px 24px 44px' }}>
        <div className="ctaOrb1"></div>
        <div className="ctaOrb2"></div>
        <div className="ctaOrb3"></div>
        <div className="ctaBox glass sheen">
          <p className="eyebrow">RIGHT NOW</p>
          <h2 className="ctaTitle">망설임은 시작만 늦출 뿐</h2>
          <p className="ctaLead">
            카카오톡으로 편하게 문의해 주세요.<br/>
            상담은 무료, 본인에게 맞는 강의를 같이 찾아드립니다.
          </p>
          <div className="ctas">
            <a href={KAKAO_OPEN_CHAT} target="_blank" rel="noopener noreferrer" className="btnCoral"><Icons.Kakao /> 카카오톡으로 무료 상담</a>
            <Link href="/store" className="btnGhost">강의 전체보기</Link>
          </div>
          <p className="ctaMeta">평균 응답 시간 <strong>15분 이내</strong> · 평일 09:00–18:00</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footerInner">
          <p className="footerLogo">AI놀자</p>
          <div className="footerLinks">
            {['이용약관', '개인정보처리방침', 'FAQ', '사업자 정보'].map((l, i, arr) => (
              <Fragment key={l}>
                <a href="#">{l}</a>
                {i < arr.length - 1 && <span>·</span>}
              </Fragment>
            ))}
          </div>
          <p className="footerFine">
            에이아이놀자 · 대표: 최경환 · 070-8028-2616 · ainolza@naver.com<br/>
            © 2026 AI놀자. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
