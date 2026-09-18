import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GoalForm } from './GoalForm'
import type { Goal } from '@/types'

interface GoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing?: Goal
}

export function GoalFormDialog({ open, onOpenChange, editing }: GoalFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar meta' : 'Nova meta'}</DialogTitle>
        </DialogHeader>
        {open && <GoalForm editing={editing} onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}
