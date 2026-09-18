import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreditCardForm } from './CreditCardForm'
import type { CreditCard } from '@/types'

interface CreditCardFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing?: CreditCard
}

export function CreditCardFormDialog({ open, onOpenChange, editing }: CreditCardFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar cartão' : 'Novo cartão'}</DialogTitle>
        </DialogHeader>
        {open && (
          <CreditCardForm editing={editing} onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
