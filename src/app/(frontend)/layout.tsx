import { ThemeProvider } from '../../components/theme-provider'
import { Header } from '../../components/layout/header'
import { SiteFooter } from '../../components/layout/site-footer'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-pretendard antialiased bg-[#050505] text-foreground flex flex-col min-h-screen">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </ThemeProvider>
    </div>
  )
}
