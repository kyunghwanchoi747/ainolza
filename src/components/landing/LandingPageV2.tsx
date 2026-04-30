'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import './landing-v2.css'

const KAKAO_OPEN_CHAT = 'https://open.kakao.com/o/s7kkWTfh'

/* ─── SVG Icons ───────────────────────────────────────────────── */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l5 5L20 6" />
  </svg>
)
const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
)
const ExtIcon = () => (
  <svg className="toolExtIcon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4h6v6" />
    <path d="M10 14L20 4" />
    <path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
  </svg>
)
const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.88 5.37 4.7 6.78l-.98 3.6c-.1.38.32.68.66.47L10.62 19.3c.45.04.91.07 1.38.07 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
  </svg>
)
const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
  </svg>
)
const QuoteIcon = () => (
  <svg className="reviewQuoteIcon" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
    <path d="M7 7h4v4H9c0 2 1 3 3 3v2c-4 0-5-3-5-5V7zm8 0h4v4h-2c0 2 1 3 3 3v2c-4 0-5-3-5-5V7z" />
  </svg>
)
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />
  </svg>
)
const TargetIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    <circle cx="17" cy="7" r="2.5" />
    <path d="M16 14c3 .3 5 2.3 5 5" />
  </svg>
)
const SparkIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
)

/* ─── Data ───────────────────────────────────────────────────── */
const COURSES = [
  {
    badge: '바이브 코딩',
    title: '바이브코딩 입문',
    desc: '코딩 지식 없이도 AI와 대화하며 나만의 웹사이트를 만듭니다. 4주 만에 실제 배포까지.',
    meta: ['4주 · 주 2회', '온라인 실시간', '왕초보 환영'],
    priceOld: '490,000',
    price: '390,000',
    hot: false,
    href: '/store/vibe-coding-101',
  },
  {
    badge: 'ChatGPT',
    title: 'ChatGPT 실전 활용',
    desc: '이메일, 보고서, 마케팅 글까지. 직장에서 바로 쓰는 프롬프트 30개와 나만의 템플릿.',
    meta: ['3주 · 주 2회', '온라인 실시간', '직장인 맞춤'],
    priceOld: '350,000',
    price: '290,000',
    hot: false,
    href: '/store',
  },
  {
    badge: 'AI 수익화',
    title: 'AI 수익화 클래스',
    desc: '콘텐츠, 사이드 프로젝트, 자동화까지. AI로 부가수익 만드는 법을 실제 사례로 배웁니다.',
    meta: ['6주 · 주 1회', '오프라인 포함', '심화 과정'],
    priceOld: '750,000',
    price: '590,000',
    hot: true,
    href: '/store',
  },
]

const TOOLS = [
  { tag: 'web', tagLabel: '웹 서비스', name: '무료 판례 검색 AI', desc: '대법원 판례를 자연어로 검색하고 AI가 핵심을 정리', href: '/labs' },
  { tag: 'web', tagLabel: '웹 서비스', name: '전세계 실시간 웹사이트 순위', desc: '전 세계에서 떠오르는 웹사이트를 실시간 추적', href: '/labs' },
  { tag: 'chrome', tagLabel: 'Chrome 확장', name: 'NotebookLM Web Importer', desc: '웹페이지를 NotebookLM으로 한 번에 가져오는 확장', href: '/labs' },
  { tag: 'chrome-blue', tagLabel: 'Chrome 확장', name: 'NotebookLM Bulk Delete', desc: 'NotebookLM의 노트를 일괄 삭제하는 확장', href: '/labs' },
]

const WHYS = [
  { Icon: HeartIcon, title: '초보자도 OK', desc: '코딩·AI 경험이 전혀 없어도 괜찮아요. 처음부터 차근차근, 용어도 쉽게 풀어서 설명합니다.' },
  { Icon: TargetIcon, title: '실전 중심 커리큘럼', desc: '이론보다 결과물. 첫 주부터 직접 만들어 보면서 "진짜 내 것"으로 익힙니다.' },
  { Icon: UsersIcon, title: '소수 정예 수업', desc: '클래스당 최대 12명. 질문하기 편한 분위기에서 1:1에 가까운 피드백을 받을 수 있어요.' },
  { Icon: SparkIcon, title: '평생 커뮤니티', desc: '강의 끝나도 이어지는 동문 모임과 업데이트. AI는 빠르게 바뀌니까, 학습도 계속 함께.' },
]

const REVIEWS = [
  { quote: '처음엔 제가 할 수 있을까 반신반의했는데, 선생님이 진짜 제 속도에 맞춰주셔서 따라갈 수 있었어요. 이제 혼자서도 ChatGPT로 업무 메일을 쓰고 있습니다.', name: '김정희', meta: '54세 · 교사', initial: '김', color: '#D4756E' },
  { quote: '은퇴 후 뭘 해야 할지 막막했는데, 바이브코딩 수업 듣고 제 사업 홈페이지를 직접 만들었어요. 주변에서 놀라워해요, "이걸 네가 만들었다고?"', name: '박성호', meta: '61세 · 자영업', initial: '박', color: '#B8604F' },
  { quote: '소수 정예라 질문을 편하게 할 수 있어서 좋았어요. 내가 뒤처지지 않나 눈치 볼 필요 없이, 모르는 건 그 자리에서 바로 해결하고 넘어가는 방식이 맞았습니다.', name: '이미영', meta: '47세 · 주부', initial: '이', color: '#8C4A3E' },
]

/* ─── Component ──────────────────────────────────────────────── */
export default function LandingPageV2() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const counter1 = useRef<HTMLSpanElement>(null)
  const counter2 = useRef<HTMLSpanElement>(null)
  const counter3 = useRef<HTMLSpanElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const isPausedRef = useRef(false)

  // Carousel auto-advance
  useEffect(() => {
    const slides = 5
    const SLIDE_MS = 4500
    const BOOK_SLIDE_MS = 3000
    let timer: ReturnType<typeof setTimeout> | null = null
    function schedule(idx: number) {
      const isBook = idx >= 3
      timer = setTimeout(() => {
        if (!isPausedRef.current) {
          setCurrentSlide((c) => (c + 1) % slides)
        } else {
          schedule(idx)
        }
      }, isBook ? BOOK_SLIDE_MS : SLIDE_MS)
    }
    schedule(currentSlide)
    return () => { if (timer) clearTimeout(timer) }
  }, [currentSlide])

  // Counter animation per slide
  useEffect(() => {
    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }
    function countUp(el: HTMLSpanElement | null, from: number, to: number, duration: number, format?: (v: number) => string) {
      if (!el) return
      const start = performance.now()
      function tick(now: number) {
        const t = Math.min(1, (now - start) / duration)
        const v = from + (to - from) * easeOutCubic(t)
        if (el) el.textContent = format ? format(v) : Math.round(v).toLocaleString()
        if (t < 1) requestAnimationFrame(tick)
        else if (el) el.textContent = format ? format(to) : to.toLocaleString()
      }
      requestAnimationFrame(tick)
    }

    if (currentSlide === 0) countUp(counter1.current, 0, 1000, 2200)
    else if (currentSlide === 1) countUp(counter2.current, 0, 98, 1800)
    else if (currentSlide === 2) countUp(counter3.current, 0, 4.8, 1800, (v) => v.toFixed(1))
  }, [currentSlide])

  return (
    <div className="landingV2Root">
      {/* 자체 HEADER는 layout의 Header와 중복되므로 제거 */}

      {/* HERO */}
      <section className="hero">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="orb orb4" />
        <div className="heroGrid">
          <div className="heroCopy">
            <span className="pill" style={{ color: '#FA8072', fontSize: 17 }}>
              <span style={{ color: '#FF5D5D', fontSize: 18 }}>놀면서 배우는 AI · 만들면서 익히는 AI</span>
            </span>
            <h1 className="heroTitle">
              {Array.from('AI놀자에서').map((c, i) => (
                <span key={`r1-${i}`} className="hoverPop">{c}</span>
              ))}<br />
              {Array.from('직접 만나보세요').map((c, i) => (
                <span key={`r2-${i}`} className="hoverPop">{c}</span>
              ))}
            </h1>
            <p className="heroLead">
              직접 만든 도구와 실험실, 그리고 강의로<br />
              평범한 사람도 AI로 결과를 만들 수 있습니다.
            </p>
            <div className="ctas">
              <Link href="/labs" className="btnCoral">
                도구 둘러보기 <ArrowIcon />
              </Link>
              <Link href="/labs" className="btnGhost">
                AI 실험실 체험
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="social">
        <div
          ref={stageRef}
          className="socialStage"
          onMouseEnter={() => { isPausedRef.current = true }}
          onMouseLeave={() => { isPausedRef.current = false }}
        >
          <div className={`socialSlide${currentSlide === 0 ? ' active' : ''}`}>
            <div className="slideStack">
              <div className="bigNum">
                <span ref={counter1}>0</span><small>+</small>
              </div>
              <div className="slideLabel" style={{ width: 510 }}>
                <strong>1,000명 이상</strong>의 수강생이 AI놀자와 함께했습니다
              </div>
            </div>
          </div>
          <div className={`socialSlide${currentSlide === 1 ? ' active' : ''}`}>
            <div className="slideStack">
              <div className="bigNum">
                <span ref={counter2}>0</span><small>%</small>
              </div>
              <div className="slideLabel" style={{ lineHeight: 1.85 }}>
                <strong>98%</strong>의 강의 만족도
              </div>
            </div>
          </div>
          <div className={`socialSlide${currentSlide === 2 ? ' active' : ''}`}>
            <div className="slideStack">
              <div className="stars-big" style={{ letterSpacing: '3.9px' }}>★ ★ ★ ★ ★</div>
              <div className="bigNum">
                <span ref={counter3}>0.0</span><small>/ 5.0</small>
              </div>
              <div className="slideLabel" style={{ letterSpacing: '0.5px' }}>
                <strong>평균 4.8 이상</strong>의 만족도 평점
              </div>
            </div>
          </div>
          <div className={`socialSlide bookSlide${currentSlide === 3 ? ' active' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bookCover" src="/store/uncomfortable-ai/thumbnail.png" alt="불편한 AI" />
            <div className="slideStack">
              <span className="bookTag">저서</span>
              <div className="bookTitle">『불편한 AI』</div>
              <p className="bookDesc">
                <strong>AI 리터러시</strong>를 기르기 위한<br />입문자를 위한 서적
              </p>
            </div>
          </div>
          <div className={`socialSlide bookSlide${currentSlide === 4 ? ' active' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bookCover" src="/store/personal-intelligence/thumbnail.png" alt="퍼스널 인텔리전스" />
            <div className="slideStack">
              <span className="bookTag">2026 신간</span>
              <div className="bookTitle">『퍼스널 인텔리전스』</div>
              <p className="bookDesc">
                <strong>구글 워크스페이스</strong>를<br />제대로 활용하는 방법
              </p>
            </div>
          </div>
        </div>
        <div className="socialDots">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              type="button"
              className={`socialDot${currentSlide === i ? ' active' : ''}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="section">
        <div className="container">
          <div className="headingCenter">
            <p className="eyebrow">Featured Courses</p>
            <h2 className="h2">지금, 가장 많이 찾는 강의</h2>
            <p className="sectionLead">초보자부터 실무자까지, 당신의 수준에 맞춰 시작할 수 있어요.</p>
          </div>
          <div className="courseGrid">
            {COURSES.map((c, i) => (
              <div key={i} className="courseCard glass sheen">
                {c.hot && <div className="hotBadge">HOT</div>}
                <div className="courseHead"><span className="courseBadge">{c.badge}</span></div>
                <div className="courseBody">
                  <h3 className="courseTitle">{c.title}</h3>
                  <p className="courseDesc">{c.desc}</p>
                  <div className="courseMeta">
                    {c.meta.map((m, j) => (
                      <div key={j} className="metaRow"><CheckIcon /> {m}</div>
                    ))}
                  </div>
                  <div className="priceRow">
                    <div>
                      <p className="priceOld">₩ {c.priceOld}</p>
                      <p className="priceNow">₩ {c.price}</p>
                    </div>
                    <Link href={c.href} className="btnCoral sm">
                      자세히 보기 <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link href="/store" className="btnGhost">
              전체 강의 보기 <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="sectionHeadRow">
            <div>
              <p className="eyebrow">AI놀자 프로젝트</p>
              <h2 className="h2">도구</h2>
              <p className="sectionLead">직접 기획·개발해 운영 중인 무료 웹 서비스와 Chrome 확장</p>
            </div>
            <Link href="/labs" className="seeAll">
              전체 보기 <ChevronIcon />
            </Link>
          </div>
          <div className="toolGrid">
            {TOOLS.map((t, i) => (
              <Link key={i} href={t.href} className="toolCard glass sheen">
                <div className="toolTopRow">
                  <span className={`toolTag ${t.tag}`}>{t.tagLabel}</span>
                  <ExtIcon />
                </div>
                <h3 className="toolName">{t.name}</h3>
                <p className="toolDesc">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="sectionAlt">
        <div className="container">
          <div className="whyHead">
            <div>
              <p className="eyebrow">Why AI놀자</p>
              <h2 className="h2">왜 많은 분들이<br />AI놀자를 선택할까요?</h2>
            </div>
            <p className="whyLead">
              AI놀자는 교육 콘텐츠 회사가 아닙니다. 7년간 중장년 세대와 함께 직접 현장에서 만들어온,
              <strong>&ldquo;나도 할 수 있다&rdquo;</strong>는 경험을 파는 곳입니다.
            </p>
          </div>
          <div className="whyGrid">
            {WHYS.map((w, i) => (
              <div key={i} className="whyCard glass sheen">
                <div className="whyIcon"><w.Icon /></div>
                <h3 className="whyTitle">{w.title}</h3>
                <p className="whyDesc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="headingCenter">
            <p className="eyebrow">Real Stories</p>
            <h2 className="h2">먼저 시작한 분들의 이야기</h2>
            <p className="sectionLead">매주 업데이트되는 실제 수강 후기.</p>
          </div>
          <div className="reviewGrid">
            {REVIEWS.map((r, i) => (
              <div key={i} className="reviewCard glass sheen">
                <QuoteIcon />
                <div className="stars">
                  {[0, 1, 2, 3, 4].map((j) => <StarIcon key={j} />)}
                </div>
                <p className="reviewQuote">&ldquo;{r.quote}&rdquo;</p>
                <div className="reviewer">
                  <div className="avatar" style={{ background: r.color }}>{r.initial}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="reviewerName">{r.name}</p>
                    <p className="reviewerMeta">{r.meta}</p>
                  </div>
                  <span className="reviewerTag">수강 완료</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="finalCta">
        <div className="ctaOrb1" />
        <div className="ctaOrb2" />
        <div className="ctaOrb3" />
        <div className="ctaBox glass sheen">
          <p className="eyebrow">지금 시작</p>
          <h2 className="ctaTitle">망설이는 시간이<br />가장 아쉬운 시간입니다.</h2>
          <p className="ctaLead">
            카카오톡으로 편하게 문의해 주세요.<br />
            상담은 무료, 본인에게 맞는 강의를 같이 찾아드립니다.
          </p>
          <div className="ctas">
            <a href={KAKAO_OPEN_CHAT} target="_blank" rel="noopener noreferrer" className="btnCoral">
              <KakaoIcon /> 카카오톡으로 무료 상담
            </a>
            <Link href="/store" className="btnGhost">강의 전체보기</Link>
          </div>
          <p className="ctaMeta">
            평균 응답 시간 <strong>15분 이내</strong> · 평일 09:00–18:00
          </p>
        </div>
      </section>
    </div>
  )
}
