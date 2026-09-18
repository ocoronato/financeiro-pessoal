import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { GoalCard } from '@/features/goals/GoalCard'
import { GoalFormDialog } from '@/features/goals/GoalFormDialog'
import { AddGoalAmountDialog } from '@/features/goals/AddGoalAmountDialog'
import { useGoals } from '@/hooks/useGoals'
import { deleteGoal } from '@/services/goalService'
import { toast } from '@/hooks/use-toast'
import type { Goal } from '@/types'

export default function GoalsPage() {
  const goals = useGoals()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Goal | undefined>()
  const [addingTo, setAddingTo] = useState<Goal | undefined>()
  const [deleting, setDeleting] = useState<Goal | undefined>()

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  async function confirmDelete() {
    if (!deleting?.id) return
    await deleteGoal(deleting.id)
    toast({ title: 'Meta excluída', variant: 'success' })
    setDeleting(undefined)
  }

  return (
    <div>
      <PageHeader
        title="Metas"
        description="Defina objetivos e acompanhe seu progresso."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Nova meta
          </Button>
        }
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhuma meta cadastrada"
          description="Crie sua primeira meta, como uma reserva de emergência ou uma viagem."
          actionLabel="Criar primeira meta"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onAddAmount={() => setAddingTo(goal)}
              onEdit={() => {
                setEditing(goal)
                setFormOpen(true)
              }}
              onDelete={() => setDeleting(goal)}
            />
          ))}
        </div>
      )}

      <GoalFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <AddGoalAmountDialog goal={addingTo} open={Boolean(addingTo)} onOpenChange={(open) => !open && setAddingTo(undefined)} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir meta?"
        description={`Tem certeza que deseja excluir "${deleting?.name}"?`}
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
