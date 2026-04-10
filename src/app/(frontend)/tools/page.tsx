import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '도구 | AI놀자',
  description: 'AI놀자가 직접 만들어 운영 중인 무료 웹 서비스와 Chrome 확장 프로그램들입니다.',
}

type ToolType = 'web' | 'chrome-extension'

type Tool = {
  title: string
  description: string
  url: string
  type: ToolType
  badge?: string
  color: string
}

const TOOLS: Tool[] = [
  {
    title: '무료 판례 검색 AI',
    description:
      '대법원 판례를 자연어로 검색하고 AI가 핵심 요지를 정리해주는 무료 서비스. 변호사·법학도·일반인 모두 사용 가능.',
    url: 'https://caseai.co.kr/',
    type: 'web',
    badge: '웹 서비스',
    color: '#D4756E',
  },
  {
    title: '전세계 실시간 웹사이트 순위',
    description:
      '전 세계에서 빠르게 떠오르는 웹사이트들을 실시간으로 추적하고 트렌드를 시각화. 마케터·창업자·트렌드 분석가에게 유용.',
    url: 'https://risingsites.com/',
    type: 'web',
    badge: '웹 서비스',
    color: '#7C3AED',
  },
  {
    title: 'NotebookLM Web Importer',
    description:
      'Google NotebookLM에 웹페이지를 한 번에 가져오는 Chrome 확장. 리서치 워크플로우를 빠르게 자동화.',
    url: 'https://chromewebstore.google.com/detail/notebooklm-web-importer-a/pnnlnelknnpdljlkabehdmiapniffdlo?hl=ko&utm_source=ext_sidebar',
    type: 'chrome-extension',
    badge: 'Chrome 확장',
    color: '#10b981',
  },
  {
    title: 'NotebookLM Bulk Delete',
    description:
      'NotebookLM의 노트를 일괄 삭제할 수 있는 Chrome 확장. 정리·관리 작업 시간을 대폭 단축.',
    url: 'https://chromewebstore.google.com/detail/notebooklm-bulk-delete/jbjckccejjhlmcbmkiheicdpajbgdooo?hl=ko&utm_source=ext_sidebar',
    type: 'chrome-extension',
    badge: 'Chrome 확장',
    color: '#3B82F6',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-8 px-6">
        <div className="max-w-[1200px] mx-auto flex items-end justify-between">
          <div>
            <p className="text-brand text-sm font-medium mb-2">AI놀자가 만든 것들</p>
            <h1 className="text-4xl font-bold tracking-tight text-ink">도구</h1>
            <p className="text-body mt-3">
              직접 기획·개발해 운영 중인 무료 웹 서비스와 Chrome 확장 프로그램입니다.
              누구나 무료로 사용하실 수 있어요.
            </p>
          </div>
          <Image
            src="/mascot.png"
            alt="AI놀자 마스코트"
            width={60}
            height={60}
            className="object-contain hidden md:block"
          />
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {TOOLS.map((t) => (
              <a
                key={t.url}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block p-6 rounded-2xl border border-line hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white"
              >
                {/* 좌측 컬러 바 */}
                <div
                  className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full"
                  style={{ background: t.color }}
                />

                <div className="pl-3">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-block px-2.5 py-1 text-xs font-medium rounded-full"
                      style={{
                        background: `${t.color}15`,
                        color: t.color,
                      }}
                    >
                      {t.badge}
                    </span>
                    <ExternalLink className="w-4 h-4 text-sub group-hover:text-brand transition-colors" />
                  </div>

                  <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-brand transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-body leading-relaxed">{t.description}</p>

                  <div className="mt-4 text-xs text-sub truncate">
                    {t.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-surface border border-line text-center">
            <p className="text-sm text-body">
              새로운 도구나 프로그램이 만들어지면 이곳에 추가됩니다.
              <br className="md:hidden" />{' '}
              사용 중 피드백이나 제안이 있으시면{' '}
              <a href="/contact" className="text-brand hover:underline">
                문의 페이지
              </a>
              로 알려주세요.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
