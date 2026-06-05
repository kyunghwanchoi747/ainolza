import Link from 'next/link'
import type { Metadata } from 'next'
import { V3Header } from '@/components/landing/v3-header'
import './labs-v3.css'

export const metadata: Metadata = {
  title: 'AI 실험실 | AI놀자',
  description: '놀면서 배우는 AI 체험 프로그램. 프롬프트 챌린지, AI 퀴즈, 이키가이 찾기까지.',
}

// 일러스트는 stroke="currentColor" 로 부모(.labIllu)의 brand 코랄을 상속.
// 면 채움은 brand-light 옅은 톤으로 통일. AI놀자 디자인 룰(ink/sub/line/brand만) 준수.
const FILL_SOFT = '#FFF1F0' // var(--brand-light) — JSX inline은 var() 못 받으니 hex 직접
const LABS = [
  {
    href: '/labs/prompt-challenge.html',
    tag: '인기',
    name: '프롬프트 챌린지',
    desc: '이미지를 보고 AI처럼 묘사해보세요',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="20" y="32" width="80" height="60" rx="6" fill={FILL_SOFT} />
        <circle cx="38" cy="52" r="5" />
        <path d="M20 80l24-22 16 16 14-12 26 22v8H20z" />
      </svg>
    ),
  },
  {
    href: '/labs/ai-vs-me.html',
    tag: '비교 게임',
    name: 'AI vs 나',
    desc: '같은 질문, 다른 시각으로 비교해보기',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="42" cy="46" r="14" fill={FILL_SOFT} />
        <path d="M22 90a20 20 0 0 1 40 0" />
        <rect x="74" y="36" width="28" height="56" rx="6" fill={FILL_SOFT} />
        <circle cx="88" cy="52" r="3" fill="currentColor" stroke="none" />
        <line x1="60" y1="66" x2="74" y2="66" strokeDasharray="3 4" />
      </svg>
    ),
  },
  {
    href: '/labs/prompt-builder.html',
    tag: '조립',
    name: '프롬프트 빌더',
    desc: '요소를 조합해서 프롬프트 만들기',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="18" y="22" width="38" height="32" rx="6" fill={FILL_SOFT} />
        <rect x="64" y="22" width="38" height="32" rx="6" fill={FILL_SOFT} />
        <rect x="18" y="66" width="38" height="32" rx="6" fill={FILL_SOFT} />
        <rect x="64" y="66" width="38" height="32" rx="6" fill={FILL_SOFT} />
        <line x1="56" y1="38" x2="64" y2="38" />
        <line x1="56" y1="82" x2="64" y2="82" />
        <line x1="37" y1="54" x2="37" y2="66" />
        <line x1="83" y1="54" x2="83" y2="66" />
      </svg>
    ),
  },
  {
    href: '/labs/ikigai',
    tag: '4가지 질문',
    name: '이키가이 찾기',
    desc: '아침에 일어날 이유를 찾는 4단계 여정',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="46" cy="46" r="26" fill={FILL_SOFT} />
        <circle cx="74" cy="46" r="26" fill={FILL_SOFT} />
        <circle cx="46" cy="74" r="26" fill={FILL_SOFT} />
        <circle cx="74" cy="74" r="26" fill={FILL_SOFT} />
        <circle cx="60" cy="60" r="9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: '/labs/ai-word-quiz.html',
    tag: '5문제',
    name: 'AI 단어 퀴즈',
    desc: '매일 5문제로 AI 어휘 익히기',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M36 14H92a4 4 0 0 1 4 4v84a4 4 0 0 1-4 4H36A6 6 0 0 1 30 100V20a6 6 0 0 1 6-6z" fill={FILL_SOFT} />
        <line x1="44" y1="36" x2="82" y2="36" />
        <line x1="44" y1="52" x2="76" y2="52" />
        <line x1="44" y1="68" x2="82" y2="68" />
        <line x1="44" y1="84" x2="68" y2="84" />
      </svg>
    ),
  },
  {
    href: '/labs/ai-or-human.html',
    tag: '2지 선택',
    name: 'AI일까? 사람일까?',
    desc: 'AI와 사람의 글 구별하기',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="60" cy="60" r="40" fill={FILL_SOFT} />
        <circle cx="48" cy="52" r="3" fill="currentColor" stroke="none" />
        <circle cx="72" cy="52" r="3" fill="currentColor" stroke="none" />
        <path d="M44 76c5-4 27-4 32 0" />
      </svg>
    ),
  },
]

export default function LabsPage() {
  return (
    <div className="labsPageRoot">
      <V3Header />
      <section className="labsPageHero" style={{ paddingTop: 120 }}>
        <p className="pageEyebrow"><span className="line"></span> AI NOLZA · LAB</p>
        <h1 className="pageTitle"><span className="grad">놀면서 배우는</span> AI 실험실</h1>
        <p className="pageLead">
          간단한 체험으로 AI의 원리를 직접 느껴보세요. 새로운 실험은 계속 추가됩니다.
        </p>
      </section>

      <section className="labsContainer">
        <div className="labGrid">
          {LABS.map((l, i) => (
            <Link key={i} className="labCard" href={l.href}>
              <div className="labCard__top">
                <span className="labTag">{l.tag}</span>
                <svg className="extIcon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 4h6v6" /><path d="M10 14L20 4" /><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
                </svg>
              </div>
              <div className="labIllu">{l.illu}</div>
              <div className="labCaption">
                <h3 className="labName">{l.name}</h3>
                <p className="labDesc">{l.desc}</p>
              </div>
            </Link>
          ))}

          {/* 곧 출시 예정 (확장 슬롯) */}
          <div className="labCard coming">
            <div className="labCard__top">
              <span className="labTag">Coming Soon</span>
            </div>
            <div className="labIllu">
              <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="60" cy="60" r="36" strokeDasharray="4 6" />
                <path d="M60 42v36M42 60h36" />
              </svg>
            </div>
            <div className="labCaption">
              <h3 className="labName">새로운 실험 준비 중</h3>
              <p className="labDesc">곧 만나보실 수 있어요!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
