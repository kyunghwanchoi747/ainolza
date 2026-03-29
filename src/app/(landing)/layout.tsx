import { ThemeProvider } from '../../components/theme-provider'
import { Header } from '../../components/layout/header'
import { SiteFooter } from '../../components/layout/site-footer'

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
    </ThemeProvider>
  )
}
