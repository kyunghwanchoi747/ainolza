import { ThemeProvider } from '../../components/theme-provider'
import { Header } from '../../components/layout/header'
import { SiteFooter } from '../../components/layout/site-footer'
import { CookieConsent } from '@/components/cookie-consent'
import { ScrollRevealInit } from '@/components/ui/scroll-reveal'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Header />
      {children}
      <SiteFooter />
      <CookieConsent />
      <ScrollRevealInit />
    </ThemeProvider>
  )
}
