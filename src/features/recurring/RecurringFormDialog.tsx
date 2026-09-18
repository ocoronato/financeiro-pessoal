import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RecurringForm } from './RecurringForm'
import type { RecurringKind, RecurringTransaction } from '@/types'

interface RecurringFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing?: RecurringTransaction
  defaultKind?: RecurringKind
}

export function RecurringFormDialog({ open, onOpenChange, editing, defaultKind }: RecurringFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar recorrência' : 'Nova recorrência'}</DialogTitle>
        </DialogHeader>
        {open && (
          <RecurringForm
            editing={editing}
            defaultKind={defaultKind}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
