'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Palette,
  ShoppingBag,
  MessageSquare,
  Download,
  BarChart3,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ShoppingCart,
  Search,
  KeyRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  href: string
  label: string
  icon: any
  shortcut?: string
  disabled?: boolean
}

const mainNavItems: NavItem[] = [
  { href: '/manager', label: '대시보드', icon: LayoutDashboard, shortcut: 'G D' },
  { href: '/manager/design', label: '페이지', icon: FileText, shortcut: 'G P' },
  { href: '/manager/design/editor/new', label: '디자인 에디터', icon: Palette, shortcut: 'G E' },
  { href: '/manager/products', label: '상품', icon: ShoppingBag, shortcut: 'G S' },
  { href: '/manager/posts', label: '게시판', icon: MessageSquare, shortcut: 'G B' },
  { href: '/manager/programs', label: '프로그램', icon: Download, shortcut: 'G R' },
  { href: '/manager/orders', label: '주문관리', icon: ShoppingCart, shortcut: 'G O' },
  { href: '/manager/access', label: '강의실 권한', icon: KeyRound },
  { href: '/manager/enrollments', label: '수강신청', icon: ClipboardList, shortcut: 'G N' },
  { href: '/manager/seo', label: 'SEO', icon: Search, shortcut: 'G S' },
  { href: '/manager/analytics', label: '통계', icon: BarChart3, shortcut: 'G A', disabled: true },
]

const bottomNavItems: NavItem[] = [
  { href: '/manager/settings', label: '설정', icon: Settings },
]

export function ManagerSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/manager') return pathname === '/manager'
    return pathname.startsWith(href)
  }

  const NavItem = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href)
    const content = (
      <Link
        href={item.disabled ? '#' : item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
          active
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          item.disabled && 'opacity-40 pointer-events-none',
          collapsed && 'justify-center px-2'
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.disabled && (
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">준비중</span>
            )}
          </>
        )}
      </Link>
    )

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.shortcut && (
              <span className="text-[10px] text-muted-foreground">{item.shortcut}</span>
            )}
          </TooltipContent>
        </Tooltip>
      )
    }

    return content
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-14 items-center border-b px-4', collapsed && 'justify-center px-2')}>
        <Link href="/manager" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            AI
          </div>
          {!collapsed && <span className="font-bold text-lg">놀자</span>}
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <Separator />

      {/* Bottom nav */}
      <div className="space-y-1 p-3">
        {bottomNavItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        {/* View site link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all',
            collapsed && 'justify-center px-2'
          )}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!collapsed && <span>사이트 보기</span>}
        </a>
      </div>

      {/* Collapse toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  )
}
