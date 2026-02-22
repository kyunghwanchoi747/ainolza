import React from 'react'
export { BrandLogo } from '../BrandLogo'
import { HeaderClient } from './HeaderClient'
import { getPayload } from '@/lib/payload'

async function getNavItems() {
  try {
    const payload = await getPayload()
    const nav = await payload.findGlobal({
      slug: 'main-nav',
    })

    if (nav.items && nav.items.length > 0) {
      return nav.items.map((item: any) => ({
        name: item.label,
        href: item.link,
        icon: item.icon || 'Rocket', // Pass string instead of component
      }))
    }
  } catch (err) {
    console.error('Failed to fetch MainNav:', err)
  }

  return [
    { name: '홈', href: '/', icon: 'Rocket' },
    { name: '스토어', href: '/shop', icon: 'ShoppingBag' },
    { name: '강의실', href: '/courses', icon: 'BookOpen' },
    { name: '커뮤니티', href: '/community', icon: 'MessageSquare' },
    { name: '문의하기', href: '/inquiry', icon: 'HelpCircle' },
  ]
}

export async function Header({ user }: { user?: any }) {
  const navItems = await getNavItems()
  return <HeaderClient user={user} navItems={navItems} />
}
