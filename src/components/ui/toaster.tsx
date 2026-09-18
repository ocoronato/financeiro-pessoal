import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { dismissToast, useToasts } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function Toaster() {
  const toasts = useToasts()

  if (toasts.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 p-4 sm:bottom-4 sm:left-auto sm:right-4 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'animate-in fade-in slide-in-from-bottom-4 flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg',
            t.variant === 'destructive' && 'border-expense/30',
            t.variant === 'success' && 'border-income/30',
          )}
        >
          {t.variant === 'success' && <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-income" />}
          {t.variant === 'destructive' && <AlertCircle className="mt-0.5 size-5 shrink-0 text-expense" />}
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-medium">{t.title}</p>
            {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
