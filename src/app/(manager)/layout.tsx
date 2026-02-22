import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/manager/Sidebar'
import { TopBar } from '@/components/manager/TopBar'
import '../(frontend)/styles.css'

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

  // Fetch badge counts, site title, and unread notifications for sidebar/topbar
  let badges: Record<string, number> = {}
  let siteTitle = 'AI놀자'
  let unreadNotifications = 0
  try {
    const [pendingOrders, pendingInquiries, customerCount, seoSettings, unreadNotifs] =
      await Promise.all([
        payload.count({ collection: 'orders', where: { status: { equals: 'pending' } } }),
        payload.count({ collection: 'inquiries', where: { status: { equals: 'pending' } } }),
        payload.count({ collection: 'users' }),
        payload.findGlobal({ slug: 'seo-settings' }),
        payload.count({ collection: 'notifications' as any, where: { isRead: { equals: false } } }),
      ])
    badges = {
      pendingOrders: pendingOrders.totalDocs,
      pendingInquiries: pendingInquiries.totalDocs,
      customerCount: customerCount.totalDocs,
      unreadNotifications: unreadNotifs.totalDocs,
    }
    unreadNotifications = unreadNotifs.totalDocs
    if ((seoSettings as any)?.title) {
      siteTitle = (seoSettings as any).title
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
      <body className="bg-[#f4f7fa] min-h-screen" style={{ color: '#1e293b' }}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar badges={badges} siteTitle={siteTitle} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar user={userInfo} unreadNotifications={unreadNotifications} />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
