import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOBILE_TAB_ITEMS, MOBILE_MORE_ITEMS } from './nav-items'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { useTransactionDialog } from '@/features/transactions/TransactionDialogProvider'

export function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const { openCreate } = useTransactionDialog()
  const isMoreActive = MOBILE_MORE_ITEMS.some((item) => item.to === location.pathname)

  return (
    <>
      <button
        type="button"
        onClick={() => openCreate()}
        className="fixed bottom-20 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95 md:hidden"
        aria-label="Nova transação"
      >
        <Plus className="size-6" />
      </button>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 flex border-t border-sidebar-border bg-sidebar md:hidden">
        {MOBILE_TAB_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-sidebar-foreground/60',
                isActive && 'text-primary',
              )
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-sidebar-foreground/60',
            isMoreActive && 'text-primary',
          )}
        >
          <Menu className="size-5" />
          Mais
        </button>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="pb-8">
          <SheetHeader>
            <SheetTitle>Mais opções</SheetTitle>
          </SheetHeader>
          <div className="mt-2 grid grid-cols-4 gap-3">
            {MOBILE_MORE_ITEMS.map((item) => (
              <SheetClose key={item.to} asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-2 rounded-xl border border-transparent p-3 text-center text-xs font-medium text-foreground/80',
                      'hover:bg-secondary',
                      isActive && 'border-border bg-secondary text-foreground',
                    )
                  }
                >
                  <item.icon className="size-5" />
                  {item.label}
                </NavLink>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
