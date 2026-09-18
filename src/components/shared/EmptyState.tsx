import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-secondary/40 px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(120px 90px at 50% 0%, var(--color-primary) 0%, transparent 70%)',
          opacity: 0.08,
        }}
      />
      <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/10">
        <Icon className="size-7 text-primary" strokeWidth={1.75} />
      </div>
      <div className="relative space-y-1.5">
        <p className="text-base font-semibold tracking-tight">{title}</p>
        {description && <p className="mx-auto max-w-xs text-sm text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="relative mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
