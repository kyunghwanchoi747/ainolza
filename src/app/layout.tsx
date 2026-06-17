import type { Viewport } from 'next'
import './globals.css'

// 모바일 viewport 명시 — 미설정 시 일부 브라우저가 자체 기본값(예: 980px)을 적용해
// 좌우 스크롤이 생긴다. width=device-width, initial-scale=1 가 표준.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata = {
  title: {
    default: 'AI놀자 - 놀면서 배우는 AI 교육 플랫폼',
    template: '%s | AI놀자',
  },
  description: '인공지능을 놀이처럼 배우는 AI 교육 플랫폼. 바이브 코딩, 프롬프트 챌린지, AI 실험실까지.',
  keywords: ['AI 교육', 'AI놀자', '바이브코딩', '프롬프트 엔지니어링', 'AI 학습', '코딩 교육'],
  authors: [{ name: 'AI놀자' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'AI놀자',
    title: 'AI놀자 - 놀면서 배우는 AI 교육 플랫폼',
    description: '인공지능을 놀이처럼 배우는 AI 교육 플랫폼. 바이브 코딩, 프롬프트 챌린지, AI 실험실까지.',
  },
  robots: {
    index: true,
    follow: true,
  },
  // 검색엔진 사이트 소유 확인용 — 발급 후 영구 유지(제거 시 등록 풀림)
  verification: {
    other: {
      'naver-site-verification': 'd7ba6e6eafa19eab3e308e2e818b557c245ada9b',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B10TJEVQQ4"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-B10TJEVQQ4');
            `,
          }}
        />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
