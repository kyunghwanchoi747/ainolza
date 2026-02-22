'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/manager/cn'
import type { NavItem } from '@/lib/manager/navigation'

interface SidebarItemProps {
  item: NavItem
  collapsed: boolean
  depth?: number
  badges?: Record<string, number>
}

export function SidebarItem({ item, collapsed, depth = 0, badges }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = item.href
    ? pathname === item.href || (item.href !== '/manager' && pathname.startsWith(item.href))
    : false

  const IconComponent = (LucideIcons as any)[item.icon]
  const badgeCount = item.badge ? (badges?.[item.badge] ?? 0) : 0

  const content = (
    <span
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150 cursor-pointer',
        depth === 0 ? 'font-medium' : 'font-normal text-slate-600',
        depth > 0 && 'pl-8',
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
        collapsed && depth === 0 && 'justify-center px-2',
      )}
    >
      {IconComponent && (
        <IconComponent
          size={depth === 0 ? 18 : 15}
          className={cn('shrink-0', isActive ? 'text-blue-600' : 'text-slate-400')}
        />
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.isNew && (
            <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
              New
            </span>
          )}
          {badgeCount > 0 && (
            <span className="text-[11px] font-semibold bg-red-500 text-white min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
              {badgeCount > 99 ? '99+' : badgeCount}
            </span>
          )}
        </>
      )}
    </span>
  )

  if (!item.href) return content

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return <Link href={item.href}>{content}</Link>
}
