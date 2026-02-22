

interface SidebarGroupProps {
  label: string
  collapsed: boolean
  children: React.ReactNode
}

export function SidebarGroup({ label, collapsed, children }: SidebarGroupProps) {
  return (
    <div className="mb-2">
      {!collapsed && (
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1 mt-3">
          {label}
        </p>
      )}
      {collapsed && <div className="border-t border-slate-100 my-2 mx-2" />}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
