import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'
import { Button } from '@/components/ui/button'
import { useTransactionDialog } from '@/features/transactions/TransactionDialogProvider'

export function Sidebar() {
  const { openCreate } = useTransactionDialog()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
      <div className="mb-6 flex items-center px-2">
        <span className="bg-gradient-to-br from-primary to-primary-strong bg-clip-text text-2xl font-bold italic tracking-tight text-transparent">
          SHADY
        </span>
      </div>

      <Button className="mb-6 w-full" onClick={() => openCreate()}>
        <Plus className="size-4" />
        Nova transação
      </Button>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors',
                'hover:bg-secondary hover:text-sidebar-foreground',
                isActive && 'bg-secondary font-semibold text-sidebar-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-primary" aria-hidden="true" />
                )}
                <item.icon className="size-[18px]" strokeWidth={isActive ? 2.25 : 2} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <p className="px-2 text-xs text-muted-foreground">Seus dados ficam só neste dispositivo.</p>
    </aside>
  )
}
