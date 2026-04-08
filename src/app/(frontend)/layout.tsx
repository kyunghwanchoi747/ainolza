import { ThemeProvider } from '../../components/theme-provider'
import { Header } from '../../components/layout/header'
import { SiteFooter } from '../../components/layout/site-footer'
import { MigrationPopup } from '@/components/migration-popup'
import { CookieConsent } from '@/components/cookie-consent'

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
        <MigrationPopup />
        <CookieConsent />
      </ThemeProvider>
    </div>
  )
}
