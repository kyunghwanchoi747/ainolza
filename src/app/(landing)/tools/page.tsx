import type { Metadata } from 'next'
import { V3Header } from '@/components/landing/v3-header'
import './tools-v3.css'

export const metadata: Metadata = {
  title: '도구 | AI놀자',
  description: 'AI놀자가 직접 만들어 운영 중인 무료 웹 서비스와 Chrome 확장 프로그램들입니다.',
}

const TOOLS = [
  {
    title: '무료 판례 검색 AI',
    description:
      '대법원 판례를 자연어로 검색하고 AI가 핵심 요지를 정리해주는 무료 서비스. 변호사·법학도·일반인 모두 사용 가능.',
    url: 'https://caseai.co.kr/',
    badge: '웹 서비스',
    cardBg: 'linear-gradient(180deg, #A8B4FF 0%, #9D8FFF 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="60" y1="22" x2="60" y2="92" />
        <line x1="42" y1="92" x2="78" y2="92" />
        <circle cx="60" cy="22" r="3.5" fill="rgba(255,255,255,0.96)" />
        <line x1="22" y1="32" x2="98" y2="32" />
        <path d="M22 32 L12 60 Q22 70 32 60 Z" fill="rgba(255,255,255,0.25)" />
        <path d="M98 32 L88 60 Q98 70 108 60 Z" fill="rgba(255,255,255,0.25)" />
      </svg>
    ),
  },
  {
    title: '전세계 실시간 웹사이트 순위',
    description:
      '전 세계에서 빠르게 떠오르는 웹사이트들을 실시간으로 추적하고 트렌드를 시각화. 마케터·창업자·트렌드 분석가에게 유용.',
    url: 'https://risingsites.com/',
    badge: '웹 서비스',
    cardBg: 'linear-gradient(180deg, #6E8AFF 0%, #5470E5 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="18" y="22" width="84" height="76" rx="10" fill="rgba(255,255,255,0.18)" />
        <line x1="30" y1="86" x2="30" y2="78" />
        <line x1="46" y1="86" x2="46" y2="62" />
        <line x1="62" y1="86" x2="62" y2="50" />
        <line x1="78" y1="86" x2="78" y2="42" />
        <line x1="94" y1="86" x2="94" y2="34" />
        <polyline points="30,72 46,58 62,46 78,40 94,34" strokeWidth={4} />
        <circle cx="94" cy="34" r="4" fill="rgba(255,255,255,0.96)" />
      </svg>
    ),
  },
  {
    title: 'NotebookLM Web Importer',
    description:
      'Google NotebookLM에 웹페이지를 한 번에 가져오는 Chrome 확장. 리서치 워크플로우를 빠르게 자동화.',
    url: 'https://chromewebstore.google.com/detail/notebooklm-web-importer-a/pnnlnelknnpdljlkabehdmiapniffdlo?hl=ko&utm_source=ext_sidebar',
    badge: 'Chrome 확장',
    bonus: '⭐ 5.0 · 3,000+ 사용자',
    cardBg: 'linear-gradient(180deg, #FFB8D9 0%, #FF98C2 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="28" y="20" width="64" height="84" rx="6" fill="rgba(255,255,255,0.22)" />
        <line x1="40" y1="20" x2="40" y2="104" />
        <line x1="50" y1="40" x2="82" y2="40" />
        <line x1="50" y1="56" x2="82" y2="56" />
        <line x1="50" y1="72" x2="74" y2="72" />
        <path d="M22 28 Q22 22 28 22 L28 102 Q22 102 22 96 Z" fill="rgba(255,255,255,0.35)" />
      </svg>
    ),
  },
  {
    title: 'NotebookLM Bulk Delete',
    description:
      'NotebookLM의 노트를 일괄 삭제할 수 있는 Chrome 확장. 정리·관리 작업 시간을 대폭 단축.',
    url: 'https://chromewebstore.google.com/detail/notebooklm-bulk-delete/jbjckccejjhlmcbmkiheicdpajbgdooo?hl=ko&utm_source=ext_sidebar',
    badge: 'Chrome 확장',
    cardBg: 'linear-gradient(180deg, #FFAA70 0%, #FF8A47 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 36 L34 102 Q34 108 40 108 L80 108 Q86 108 86 102 L90 36" fill="rgba(255,255,255,0.22)" />
        <line x1="22" y1="36" x2="98" y2="36" />
        <path d="M48 28 L48 22 Q48 18 52 18 L68 18 Q72 18 72 22 L72 28" />
        <line x1="50" y1="54" x2="50" y2="92" />
        <line x1="60" y1="54" x2="60" y2="92" />
        <line x1="70" y1="54" x2="70" y2="92" />
      </svg>
    ),
  },
  {
    title: '뽀모도로 타이머',
    description:
      '기본 타이머·뽀모도로·시간표 모드를 지원하는 집중 관리 도구. 알림음, 다크모드, 포커스 모드 기능 포함.',
    url: '/labs/timer.html',
    badge: '무료 도구',
    cardBg: 'linear-gradient(180deg, #67E8F9 0%, #38BDF8 100%)',
    illu: (
      <svg viewBox="0 0 120 120" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="60" cy="64" r="36" fill="rgba(255,255,255,0.22)" />
        <path d="M60 46v18l12 12" />
        <path d="M48 18h24" />
        <path d="M92 32l8-8" />
      </svg>
    ),
  },
]

export default function ToolsPage() {
  return (
    <div className="toolsPageRoot">
      <V3Header />

      <section className="toolsPageHero">
        <p className="pageEyebrow"><span className="line"></span> AI NOLZA · TOOLS</p>
        <h1 className="pageTitle"><span className="grad">AI놀자가 만든</span> 무료 도구</h1>
        <p className="pageLead">
          직접 기획·개발해 운영 중인 무료 웹 서비스와 Chrome 확장 프로그램입니다.<br />
          누구나 자유롭게 사용하실 수 있어요.
        </p>
      </section>

      <section className="toolsContainer">
        <div className="toolsGrid">
          {TOOLS.map((t, i) => {
            const isExternal = /^https?:/.test(t.url)
            const linkProps = isExternal
              ? { href: t.url, target: '_blank', rel: 'noopener noreferrer' as const }
              : { href: t.url }
            return (
              <a key={i} className="toolPageCard" {...linkProps} style={{ ['--cardBg' as string]: t.cardBg } as React.CSSProperties}>
                <div className="toolPageCard__top">
                  <span className="toolPageTag">{t.badge}</span>
                  <svg className="extIcon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 4h6v6" /><path d="M10 14L20 4" /><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
                  </svg>
                </div>
                <div className="toolPageIllu">{t.illu}</div>
                <div className="toolPageCaption">
                  {t.bonus && <span className="toolPageBonus">{t.bonus}</span>}
                  <h3 className="toolPageName">{t.title}</h3>
                  <p className="toolPageDesc">{t.description}</p>
                </div>
              </a>
            )
          })}
        </div>

        <div className="toolsFootNote">
          <p>
            새로운 도구나 프로그램이 만들어지면 이곳에 추가됩니다.<br />
            사용 중 피드백이나 제안이 있으시면{' '}
            <a href="/contact" className="footLink">문의 페이지</a>로 알려주세요.
          </p>
        </div>
      </section>
    </div>
  )
}
