import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TransactionForm } from './TransactionForm'
import type { Transaction, TransactionType } from '@/types'

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing?: Transaction
  defaultType?: TransactionType
  defaultAccountId?: number
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  editing,
  defaultType,
  defaultAccountId,
}: TransactionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
        </DialogHeader>
        {open && (
          <TransactionForm
            editing={editing}
            defaultType={defaultType}
            defaultAccountId={defaultAccountId}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
