import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { getIcon } from '@/utils/icons'
import { ACCOUNT_TYPE_LABELS } from '@/types'
import type { Account } from '@/types'

interface AccountCardProps {
  account: Account
  balance: number
  onEdit: () => void
  onDelete: () => void
}

export function AccountCard({ account, balance, onEdit, onDelete }: AccountCardProps) {
  const Icon = getIcon(account.icon)

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${account.color}22`, color: account.color }}
          >
            <Icon className="size-5" />
          </span>
          <div>
            <p className="font-medium leading-tight">{account.name}</p>
            <p className="text-xs text-muted-foreground">{ACCOUNT_TYPE_LABELS[account.type]}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="size-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="size-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted-foreground">Saldo atual</p>
        <MoneyDisplay value={balance} variant={balance < 0 ? 'expense' : 'default'} size="lg" />
      </div>
    </Card>
  )
}
