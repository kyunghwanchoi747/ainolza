import '../globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ManagerShell } from '@/components/manager/manager-shell'

export const metadata = {
  title: 'AI 놀자 - 관리자',
  description: '홈페이지 관리자 패널',
}

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ManagerShell>
            {children}
          </ManagerShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
