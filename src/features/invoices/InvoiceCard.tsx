import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { getIcon } from '@/utils/icons'
import { formatDate, formatMonthYear } from '@/utils/format'
import type { CreditCard, Invoice, InvoiceStatus } from '@/types'

const STATUS_VARIANT: Record<InvoiceStatus, 'success' | 'warning' | 'destructive'> = {
  paga: 'success',
  aberta: 'warning',
  atrasada: 'destructive',
}

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paga: 'Paga',
  aberta: 'Aberta',
  atrasada: 'Atrasada',
}

interface InvoiceCardProps {
  invoice: Invoice
  card: CreditCard
  total: number
  onClick: () => void
}

export function InvoiceCard({ invoice, card, total, onClick }: InvoiceCardProps) {
  const Icon = getIcon('CreditCard')

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-secondary/50"
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${card.color}22`, color: card.color }}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{card.name}</p>
        <p className="text-xs capitalize text-muted-foreground">
          {formatMonthYear(invoice.month, invoice.year)} · vence {formatDate(invoice.dueDate)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <MoneyDisplay value={total} size="sm" className="font-medium" />
        <Badge variant={STATUS_VARIANT[invoice.status]}>{STATUS_LABEL[invoice.status]}</Badge>
      </div>
    </Card>
  )
}
