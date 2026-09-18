import { ArrowLeftRight, Check, Copy, CreditCard as CreditCardIcon, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { getIcon } from '@/utils/icons'
import { formatDate } from '@/utils/format'
import { cn } from '@/lib/utils'
import type { Account, Category, CreditCard, Transaction } from '@/types'

interface TransactionCardProps {
  transaction: Transaction
  category?: Category
  account?: Account
  toAccount?: Account
  card?: CreditCard
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  onToggleStatus: () => void
}

export function TransactionCard({
  transaction,
  category,
  account,
  toAccount,
  card,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
}: TransactionCardProps) {
  const isTransfer = transaction.type === 'transferencia'
  const Icon = isTransfer ? ArrowLeftRight : getIcon(category?.icon)
  const iconColor = isTransfer ? undefined : category?.color

  return (
    <Card className="flex items-center gap-3 p-4">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: iconColor ? `${iconColor}22` : 'var(--secondary)',
          color: iconColor ?? 'var(--muted-foreground)',
        }}
      >
        <Icon className="size-[18px]" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{transaction.description}</p>
          {transaction.installmentTotal && transaction.installmentTotal > 1 && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {transaction.installmentNumber}/{transaction.installmentTotal}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">
            {isTransfer
              ? `${account?.name ?? '—'} → ${toAccount?.name ?? '—'}`
              : [category?.name, card ? card.name : account?.name].filter(Boolean).join(' · ')}
          </span>
          <span className="shrink-0">· {formatDate(transaction.date)}</span>
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <MoneyDisplay
          value={isTransfer ? transaction.amount : transaction.type === 'despesa' ? -transaction.amount : transaction.amount}
          variant={isTransfer ? 'default' : transaction.type === 'despesa' ? 'expense' : 'income'}
          showSign={!isTransfer}
          size="sm"
          className="font-medium"
        />
        {transaction.status === 'pendente' ? (
          <Badge variant="warning" className="h-5">
            Pendente
          </Badge>
        ) : card ? (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CreditCardIcon className="size-3" /> Fatura
          </span>
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className={cn('shrink-0')}>
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="size-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="size-4" /> Duplicar
          </DropdownMenuItem>
          {!isTransfer && !card && (
            <DropdownMenuItem onClick={onToggleStatus}>
              <Check className="size-4" />
              Marcar como {transaction.status === 'pago' ? 'pendente' : 'pago'}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="size-4" /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  )
}
