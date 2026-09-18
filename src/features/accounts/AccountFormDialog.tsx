import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AccountForm } from './AccountForm'
import type { Account } from '@/types'

interface AccountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing?: Account
}

export function AccountFormDialog({ open, onOpenChange, editing }: AccountFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar conta' : 'Nova conta'}</DialogTitle>
        </DialogHeader>
        {open && <AccountForm editing={editing} onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}
