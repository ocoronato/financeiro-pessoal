import { useNavigate } from 'react-router-dom'
import { MoreVertical, Pencil, Receipt, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { formatDate } from '@/utils/format'
import type { CreditCard, Invoice } from '@/types'

interface CreditCardCardProps {
  card: CreditCard
  used: number
  currentInvoice?: Invoice
  currentInvoiceTotal: number
  onEdit: () => void
  onDelete: () => void
}

export function CreditCardCard({ card, used, currentInvoice, currentInvoiceTotal, onEdit, onDelete }: CreditCardCardProps) {
  const navigate = useNavigate()
  const available = Math.max(0, card.limit - used)
  const usagePercent = card.limit > 0 ? Math.min(100, (used / card.limit) * 100) : 0

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-5 text-white" style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)` }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{card.name}</p>
            <p className="text-sm opacity-80">{card.bank}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/20 hover:text-white">
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
        <p className="mt-5 text-xs opacity-80">Fatura atual</p>
        <p className="text-2xl font-semibold tabular-nums">
          {currentInvoiceTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        {currentInvoice && <p className="text-xs opacity-80">Vence em {formatDate(currentInvoice.dueDate)}</p>}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Limite utilizado</span>
            <span>{usagePercent.toFixed(0)}%</span>
          </div>
          <Progress value={usagePercent} indicatorClassName={usagePercent > 85 ? 'bg-expense' : undefined} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Disponível</p>
            <MoneyDisplay value={available} size="sm" className="font-medium" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Limite total</p>
            <MoneyDisplay value={card.limit} size="sm" className="font-medium" />
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={() => navigate(`/faturas?cartao=${card.id}`)}>
          <Receipt className="size-4" />
          Ver faturas
        </Button>
      </div>
    </Card>
  )
}
