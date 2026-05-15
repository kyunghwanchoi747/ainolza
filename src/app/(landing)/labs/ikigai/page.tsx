import type { Metadata } from 'next'
import { V3Header } from '@/components/landing/v3-header'
import { IkigaiClient } from './ikigai-client'

export const metadata: Metadata = {
  title: '이키가이 찾기 | AI놀자 실험실',
  description:
    '아침에 일어날 이유를 찾는 네 가지 질문. 좋아하는 것 · 잘하는 것 · 세상이 필요로 하는 것 · 돈으로 연결되는 것이 만나는 자리를 AI가 정리해 드립니다.',
}

export default function IkigaiPage() {
  return (
    <div className="min-h-screen bg-white">
      <V3Header />
      <main className="pt-24 pb-20">
        <div className="mb-12 text-center">
          <a
            href="/labs"
            className="text-xs text-sub hover:text-ink transition-colors"
          >
            ← AI 실험실로
          </a>
        </div>
        <IkigaiClient />
      </main>
    </div>
  )
}
