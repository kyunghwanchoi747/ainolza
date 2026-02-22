import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { StatsTracker } from '@/components/StatsTracker'
import { CartProvider } from '@/components/CartProvider'
import './styles.css'

export const metadata = {
  description: 'AI 놀자 - 당신의 AI 성장을 돕습니다.',
  title: 'AI 놀자',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ko">
      <body className="bg-black text-white antialiased">
        <CartProvider>
          <StatsTracker />
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
