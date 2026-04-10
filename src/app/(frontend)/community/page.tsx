import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '후기',
  description: 'AI놀자 수강생들의 실제 후기를 확인해보세요.',
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-ink mb-2">후기</h1>
          <p className="text-body mb-10">AI놀자가 제작하고 판매한 전자책과 강의, 패키지 콘텐츠의 실제 구매 후기를 모아둔 공간입니다.</p>

          <div className="text-center py-20">
            <div className="text-5xl mb-4">&#128172;</div>
            <p className="text-lg font-medium text-ink mb-2">아직 등록된 후기가 없습니다</p>
            <p className="text-sm text-sub mb-6">수강생 분들의 소중한 후기를 기다리고 있어요.</p>
            <Link href="/store" className="text-sm text-brand hover:underline">강의/책 둘러보기 &rarr;</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
