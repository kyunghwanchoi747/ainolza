import '../globals.css'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { ManagerShell } from '@/components/manager/manager-shell'
import { getPayloadClient } from '@/lib/payload'

export const metadata = {
  title: 'AI 놀자 - 관리자',
  description: '홈페이지 관리자 패널',
}

export const dynamic = 'force-dynamic'

async function checkAdmin() {
  try {
    const payload = await getPayloadClient()
    const hdrs = await headers()
    const { user } = await payload.auth({ headers: hdrs as unknown as Headers })
    if (!user) return false
    return (user as { role?: string }).role === 'admin'
  } catch {
    return false
  }
}

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    redirect('/?error=admin_only')
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ManagerShell>
        {children}
      </ManagerShell>
    </ThemeProvider>
  )
}
