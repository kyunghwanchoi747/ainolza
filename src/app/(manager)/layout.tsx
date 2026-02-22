import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/manager/Sidebar'
import { TopBar } from '@/components/manager/TopBar'

export const metadata = {
  title: 'AI놀자 관리자',
}

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const headersList = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/admin/login')
  }

  if ((user as any).userType !== 'admin') {
    redirect('/')
  }

  // Fetch badge counts for sidebar
  let badges: Record<string, number> = {}
  try {
    const [pendingOrders, pendingInquiries, customerCount] = await Promise.all([
      payload.count({ collection: 'orders', where: { status: { equals: 'pending' } } }),
      payload.count({ collection: 'inquiries', where: { status: { equals: 'pending' } } }),
      payload.count({ collection: 'users' }),
    ])
    badges = {
      pendingOrders: pendingOrders.totalDocs,
      pendingInquiries: pendingInquiries.totalDocs,
      customerCount: customerCount.totalDocs,
    }
  } catch {
    // Ignore errors - badges are non-critical
  }

  const userInfo = {
    nickname: (user as any).nickname ?? null,
    email: user.email ?? '',
  }

  return (
    <html lang="ko">
      <body className="bg-[#f4f7fa] min-h-screen">
        <div className="flex h-screen overflow-hidden">
          <Sidebar badges={badges} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar user={userInfo} />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
