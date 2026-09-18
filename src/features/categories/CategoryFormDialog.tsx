import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CategoryForm } from './CategoryForm'
import type { Category, CategoryKind } from '@/types'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing?: Category
  defaultKind?: CategoryKind
}

export function CategoryFormDialog({ open, onOpenChange, editing, defaultKind }: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
        </DialogHeader>
        {open && (
          <CategoryForm
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
