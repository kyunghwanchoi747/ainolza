import { ThemeProvider } from '../../components/theme-provider'
import { CookieConsent } from '@/components/cookie-consent'
import { ScrollRevealInit } from '@/components/ui/scroll-reveal'

// 랜딩 페이지(LandingPageV3)는 자체 Header/Footer 포함이라 layout에는 추가하지 않음
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <CookieConsent />
      <ScrollRevealInit />
    </ThemeProvider>
  )
}
