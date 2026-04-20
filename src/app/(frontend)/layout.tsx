import { ThemeProvider } from '../../components/theme-provider'
import { Header } from '../../components/layout/header'
import { SiteFooter } from '../../components/layout/site-footer'
import { CookieConsent } from '@/components/cookie-consent'
import { ScrollRevealInit } from '@/components/ui/scroll-reveal'
import { OrganicCanvas } from '@/components/ui/organic-canvas'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-pretendard antialiased bg-background text-foreground flex flex-col min-h-screen">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <OrganicCanvas />
        <Header />
        <main className="relative flex-1" style={{ zIndex: 1 }}>{children}</main>
        <SiteFooter />
        <CookieConsent />
        <ScrollRevealInit />
      </ThemeProvider>
    </div>
  )
}
