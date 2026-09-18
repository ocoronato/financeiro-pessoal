import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { addAmountToGoal } from '@/services/goalService'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import type { Goal } from '@/types'

interface AddGoalAmountDialogProps {
  goal?: Goal
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddGoalAmountDialog({ goal, open, onOpenChange }: AddGoalAmountDialogProps) {
  const [amount, setAmount] = useState(0)
  const [mode, setMode] = useState<'add' | 'remove'>('add')
  const [submitting, setSubmitting] = useState(false)

  async function handleConfirm() {
    if (!goal?.id || amount <= 0) return
    setSubmitting(true)
    try {
      await addAmountToGoal(goal.id, mode === 'add' ? amount : -amount)
      toast({ title: mode === 'add' ? 'Valor adicionado à meta' : 'Valor removido da meta', variant: 'success' })
      setAmount(0)
      setMode('add')
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('add')}
              className={cn(
                'rounded-xl border py-2 text-sm font-medium transition-colors',
                mode === 'add' ? 'border-income/30 bg-income/10 text-income' : 'border-input text-muted-foreground hover:bg-secondary',
              )}
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => setMode('remove')}
              className={cn(
                'rounded-xl border py-2 text-sm font-medium transition-colors',
                mode === 'remove' ? 'border-expense/30 bg-expense/10 text-expense' : 'border-input text-muted-foreground hover:bg-secondary',
              )}
            >
              Retirar
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-amount">Valor</Label>
            <CurrencyInput id="goal-amount" value={amount} onValueChange={setAmount} autoFocus />
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={submitting || amount <= 0}>
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
