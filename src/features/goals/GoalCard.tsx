import { MoreVertical, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getIcon } from '@/utils/icons'
import { formatCurrency, formatDate, formatPercent } from '@/utils/format'
import type { Goal } from '@/types'

interface GoalCardProps {
  goal: Goal
  onAddAmount: () => void
  onEdit: () => void
  onDelete: () => void
}

export function GoalCard({ goal, onAddAmount, onEdit, onDelete }: GoalCardProps) {
  const Icon = getIcon(goal.icon)
  const progress = goal.targetAmount > 0 ? Math.min(1, goal.currentAmount / goal.targetAmount) : 0
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)
  const completed = progress >= 1

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${goal.color}22`, color: goal.color }}
          >
            <Icon className="size-5" />
          </span>
          <div>
            <p className="font-medium leading-tight">{goal.name}</p>
            {goal.deadline && <p className="text-xs text-muted-foreground">Até {formatDate(goal.deadline)}</p>}
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

      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-2xl font-semibold tabular-nums">{formatCurrency(goal.currentAmount)}</p>
        <p className="text-sm text-muted-foreground">de {formatCurrency(goal.targetAmount)}</p>
      </div>

      <Progress value={progress * 100} className="mt-3" />

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatPercent(progress)}</span>
        <span>{completed ? 'Meta concluída!' : `Faltam ${formatCurrency(remaining)}`}</span>
      </div>

      <Button variant="outline" className="mt-4 w-full" onClick={onAddAmount}>
        <PlusCircle className="size-4" />
        Adicionar valor
      </Button>
    </Card>
  )
}
