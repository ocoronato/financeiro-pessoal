import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { eraseAllData } from '@/services/backupService'
import { toast } from '@/hooks/use-toast'

export function DangerZoneSection() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [erasing, setErasing] = useState(false)

  async function handleConfirm() {
    setErasing(true)
    try {
      await eraseAllData()
      toast({ title: 'Todos os dados foram apagados', variant: 'success' })
      setTimeout(() => window.location.reload(), 600)
    } catch {
      setErasing(false)
    }
  }

  return (
    <div className="rounded-2xl border border-expense/30 p-4">
      <p className="text-sm font-medium">Apagar todos os dados</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Remove permanentemente todas as contas, transações, cartões, categorias, metas e recorrências deste
        dispositivo. Essa ação não pode ser desfeita.
      </p>
      <Button variant="destructive" className="mt-3" onClick={() => setConfirmOpen(true)}>
        <Trash2 className="size-4" />
        Apagar todos os dados
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Apagar todos os dados?"
        description="Todos os seus dados financeiros serão apagados permanentemente deste dispositivo. Considere exportar um backup antes de continuar."
        confirmLabel={erasing ? 'Apagando...' : 'Apagar tudo'}
        destructive
        onConfirm={handleConfirm}
      />
    </div>
  )
}
