'use client'

import { useState } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/manager/cn'
import { MANAGER_NAV } from '@/lib/manager/navigation'
import { SidebarGroup } from './SidebarGroup'
import { SidebarItem } from './SidebarItem'
import { SidebarCollapsible } from './SidebarCollapsible'

interface SidebarProps {
  badges?: Record<string, number>
}

export function Sidebar({ badges }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0 overflow-hidden shrink-0"
    >
      {/* Logo area */}
      <div
        className={cn(
          'flex items-center h-14 border-b border-slate-100 px-4 shrink-0',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="font-semibold text-slate-800 truncate text-sm">AI놀자</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-0.5">
        {MANAGER_NAV.map((group) => (
          <SidebarGroup key={group.group} label={group.group} collapsed={collapsed}>
            {group.items.map((item) =>
              item.children ? (
                <SidebarCollapsible key={item.id} item={item} collapsed={collapsed} badges={badges} />
              ) : (
                <SidebarItem key={item.id} item={item} collapsed={collapsed} badges={badges} />
              ),
            )}
          </SidebarGroup>
        ))}
      </nav>
    </motion.aside>
  )
}
