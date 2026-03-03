'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ManagerSidebar } from '@/components/manager/sidebar'
import { ManagerHeader } from '@/components/manager/manager-header'
import { CommandSearch } from '@/components/manager/command-search'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'

interface ManagerShellProps {
  children: React.ReactNode
}

export function ManagerShell({ children }: ManagerShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved))
    }
  }, [])

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', JSON.stringify(next))
      return next
    })
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <ManagerSidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />

        <div
          className={cn(
            'flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'ml-16' : 'ml-60'
          )}
        >
          <ManagerHeader onSearchOpen={() => setSearchOpen(true)} />

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>

        <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
        <Toaster position="bottom-right" richColors />
      </div>
    </TooltipProvider>
  )
}
