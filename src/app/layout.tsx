import './globals.css'

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
