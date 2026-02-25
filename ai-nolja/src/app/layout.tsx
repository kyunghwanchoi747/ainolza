export const metadata = {
  title: "AI 놀자 - Director's Cut",
  description: "AI 시대, 당신은 '사용자'입니까, '디렉터'입니까?",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
