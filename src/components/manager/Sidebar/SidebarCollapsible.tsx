'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/manager/cn'
import { SidebarItem } from './SidebarItem'
import type { NavItem } from '@/lib/manager/navigation'

interface SidebarCollapsibleProps {
  item: NavItem
  collapsed: boolean
  badges?: Record<string, number>
}

export function SidebarCollapsible({ item, collapsed, badges }: SidebarCollapsibleProps) {
  const pathname = usePathname()
  const isChildActive = item.children?.some(
    (child) => child.href && (pathname === child.href || pathname.startsWith(child.href)),
  )
  const [isOpen, setIsOpen] = useState(isChildActive ?? false)

  useEffect(() => {
    if (isChildActive) setIsOpen(true)
  }, [isChildActive])

  const IconComponent = (LucideIcons as any)[item.icon]

  return (
    <div>
      <button
        onClick={() => !collapsed && setIsOpen((v) => !v)}
        className={cn(
          'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
          isChildActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
          collapsed && 'justify-center px-2',
        )}
      >
        {IconComponent && (
          <IconComponent
            size={18}
            className={cn('shrink-0', isChildActive ? 'text-blue-600' : 'text-slate-400')}
          />
        )}
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.isNew && (
              <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                New
              </span>
            )}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} className="text-slate-400" />
            </motion.div>
          </>
        )}
      </button>

      {!collapsed && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-0.5 space-y-0.5">
                {item.children?.map((child) => (
                  <SidebarItem key={child.id} item={child} collapsed={false} depth={1} badges={badges} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
