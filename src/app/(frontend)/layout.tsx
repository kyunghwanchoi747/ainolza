import { ThemeProvider } from '../../components/theme-provider'
import { Header } from '../../components/layout/header'
import { SiteFooter } from '../../components/layout/site-footer'
import { CookieConsent } from '@/components/cookie-consent'
import { ScrollRevealInit } from '@/components/ui/scroll-reveal'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-pretendard antialiased bg-background text-foreground flex flex-col min-h-screen">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CookieConsent />
        <ScrollRevealInit />
      </ThemeProvider>
    </div>
  )
}
