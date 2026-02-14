import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './styles.css'

export const metadata = {
  description: 'AI 놀자 - 당신의 AI 성장을 돕습니다.',
  title: 'AI 놀자',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const user: null = null // Temporarily disabling auth check for performance

  return (
    <html lang="ko">
      <body className="bg-black text-white antialiased">
        <Header user={user} />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
