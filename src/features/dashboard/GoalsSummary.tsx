import { Link } from 'react-router-dom'
import { Target } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/shared/EmptyState'
import { getIcon } from '@/utils/icons'
import { formatCurrency, formatPercent } from '@/utils/format'
import type { Goal } from '@/types'

export function GoalsSummary({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="Nenhuma meta cadastrada"
        description="Crie metas para acompanhar seus objetivos financeiros."
      />
    )
  }

  return (
    <div className="space-y-3">
      {goals.slice(0, 3).map((goal) => {
        const Icon = getIcon(goal.icon)
        const progress = goal.targetAmount > 0 ? Math.min(1, goal.currentAmount / goal.targetAmount) : 0
        return (
          <Card key={goal.id} className="p-4">
            <div className="flex items-center gap-3">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${goal.color}22`, color: goal.color }}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{goal.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium tabular-nums">{formatPercent(progress)}</span>
            </div>
            <Progress value={progress * 100} className="mt-3" />
          </Card>
        )
      })}
      {goals.length > 3 && (
        <Link to="/metas" className="block text-center text-sm font-medium text-primary hover:underline">
          Ver todas as metas
        </Link>
      )}
    </div>
  )
}
