import { ThemeProvider } from '../../components/theme-provider'
import { Header } from '../../components/layout/header'
import { SiteFooter } from '../../components/layout/site-footer'
import { MigrationPopup } from '@/components/migration-popup'
import { CookieConsent } from '@/components/cookie-consent'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <SiteFooter />
          <MigrationPopup />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
