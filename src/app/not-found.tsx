import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-foreground/10 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">페이지를 찾을 수 없습니다</h1>
        <p className="text-foreground/50 mb-8 text-sm">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-all text-sm"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/labs/daily-quiz.html"
            className="px-6 py-3 bg-foreground/5 border border-foreground/10 font-bold rounded-xl hover:bg-foreground/10 transition-all text-sm"
          >
            오늘의 퀴즈 풀기
          </Link>
        </div>
      </div>
    </div>
  )
}
