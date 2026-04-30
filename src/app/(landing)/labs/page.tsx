import Link from 'next/link'
import type { Metadata } from 'next'
import { V3Header } from '@/components/landing/v3-header'
import './labs-v3.css'

export const metadata: Metadata = {
  title: 'AI 실험실 | AI놀자',
  description: '놀면서 배우는 AI 체험 프로그램. 프롬프트 챌린지, AI 퀴즈, 직업 탐색기까지.',
}

const LABS = [
  {
    href: '/labs/prompt-challenge.html',
    tag: '인기',
    name: '프롬프트 챌린지',
    desc: '이미지를 보고 AI처럼 묘사해보세요',
    cardBg: 'linear-gradient(160deg, #B5C7F7 0%, #818CF8 60%, #6366F1 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="20" y="32" width="80" height="60" rx="6" fill="rgba(255,255,255,0.18)" />
        <circle cx="38" cy="52" r="5" fill="rgba(255,255,255,0.4)" />
        <path d="M20 80l24-22 16 16 14-12 26 22v8H20z" fill="rgba(255,255,255,0.25)" />
      </svg>
    ),
  },
  {
    href: '/labs/ai-vs-me.html',
    tag: '비교 게임',
    name: 'AI vs 나',
    desc: '같은 질문, 다른 시각으로 비교해보기',
    cardBg: 'linear-gradient(160deg, #5BA9D9 0%, #38BDF8 60%, #6366F1 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="42" cy="46" r="14" fill="rgba(255,255,255,0.22)" />
        <path d="M22 90a20 20 0 0 1 40 0" />
        <rect x="74" y="36" width="28" height="56" rx="6" fill="rgba(255,255,255,0.22)" />
        <circle cx="88" cy="52" r="3" fill="rgba(255,255,255,0.96)" />
        <line x1="60" y1="66" x2="74" y2="66" strokeDasharray="3 4" />
      </svg>
    ),
  },
  {
    href: '/labs/prompt-builder.html',
    tag: '조립',
    name: '프롬프트 빌더',
    desc: '요소를 조합해서 프롬프트 만들기',
    cardBg: 'linear-gradient(160deg, #6EE7B7 0%, #34D399 60%, #14B8A6 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="18" y="22" width="38" height="32" rx="6" fill="rgba(255,255,255,0.22)" />
        <rect x="64" y="22" width="38" height="32" rx="6" fill="rgba(255,255,255,0.22)" />
        <rect x="18" y="66" width="38" height="32" rx="6" fill="rgba(255,255,255,0.22)" />
        <rect x="64" y="66" width="38" height="32" rx="6" fill="rgba(255,255,255,0.22)" />
        <line x1="56" y1="38" x2="64" y2="38" />
        <line x1="56" y1="82" x2="64" y2="82" />
        <line x1="37" y1="54" x2="37" y2="66" />
        <line x1="83" y1="54" x2="83" y2="66" />
      </svg>
    ),
  },
  {
    href: '/labs/career-explorer.html',
    tag: '맞춤 추천',
    name: 'AI 직업 탐색기',
    desc: '관심사 기반 미래 직업 추천',
    cardBg: 'linear-gradient(160deg, #FFA751 0%, #FF6B6B 60%, #EE3D8A 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="20" y="40" width="80" height="62" rx="8" fill="rgba(255,255,255,0.22)" />
        <path d="M48 40v-8a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v8" />
        <line x1="20" y1="68" x2="100" y2="68" />
        <rect x="54" y="64" width="12" height="10" rx="1.5" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
  },
  {
    href: '/labs/ai-word-quiz.html',
    tag: '5문제',
    name: 'AI 단어 퀴즈',
    desc: '매일 5문제로 AI 어휘 익히기',
    cardBg: 'linear-gradient(160deg, #C4B5FD 0%, #A78BFA 60%, #8B5CF6 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M36 14H92a4 4 0 0 1 4 4v84a4 4 0 0 1-4 4H36A6 6 0 0 1 30 100V20a6 6 0 0 1 6-6z" fill="rgba(255,255,255,0.22)" />
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
    cardBg: 'linear-gradient(160deg, #FDA4AF 0%, #F43F5E 60%, #BE123C 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="60" cy="60" r="40" fill="rgba(255,255,255,0.22)" />
        <circle cx="48" cy="52" r="3" fill="rgba(255,255,255,0.96)" />
        <circle cx="72" cy="52" r="3" fill="rgba(255,255,255,0.96)" />
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
            <Link
              key={i}
              className="labCard"
              href={l.href}
              style={{ ['--cardBg' as string]: l.cardBg } as React.CSSProperties}
            >
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
