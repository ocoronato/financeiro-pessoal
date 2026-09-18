import { useRef, useState } from 'react'
import { Download, FileSpreadsheet, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { exportBackup, downloadBackupFile, parseBackupFile, importBackup, type BackupData } from '@/services/backupService'
import { buildTransactionsCsv, downloadCsv } from '@/services/csvService'
import { db } from '@/database/db'
import { toast } from '@/hooks/use-toast'

export function BackupSection() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<BackupData | undefined>()
  const [importing, setImporting] = useState(false)

  async function handleExportBackup() {
    const data = await exportBackup()
    downloadBackupFile(data)
    toast({ title: 'Backup exportado', variant: 'success' })
  }

  async function handleExportCsv() {
    const [transactions, categories, accounts] = await Promise.all([
      db.transactions.toArray(),
      db.categories.toArray(),
      db.accounts.toArray(),
    ])
    if (transactions.length === 0) {
      toast({ title: 'Nenhuma transação para exportar', variant: 'destructive' })
      return
    }
    const csv = buildTransactionsCsv(transactions, categories, accounts)
    downloadCsv(csv)
    toast({ title: 'CSV exportado', variant: 'success' })
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = parseBackupFile(String(reader.result))
        setPendingImport(data)
      } catch (err) {
        toast({
          title: 'Não foi possível importar',
          description: err instanceof Error ? err.message : undefined,
          variant: 'destructive',
        })
      }
    }
    reader.readAsText(file)
  }

  async function confirmImport() {
    if (!pendingImport) return
    setImporting(true)
    try {
      await importBackup(pendingImport)
      toast({ title: 'Backup importado com sucesso', variant: 'success' })
      setTimeout(() => window.location.reload(), 600)
    } catch (err) {
      toast({
        title: 'Falha ao importar backup',
        description: err instanceof Error ? err.message : undefined,
        variant: 'destructive',
      })
      setImporting(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Button variant="outline" onClick={handleExportBackup}>
          <Download className="size-4" />
          Exportar backup
        </Button>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="size-4" />
          Importar backup
        </Button>
        <Button variant="outline" onClick={handleExportCsv}>
          <FileSpreadsheet className="size-4" />
          Exportar CSV
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        O backup gera um arquivo financeiro-backup.json com todos os seus dados. Guarde-o em um lugar seguro.
      </p>

      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelected} />

      <ConfirmDialog
        open={Boolean(pendingImport)}
        onOpenChange={(open) => !open && setPendingImport(undefined)}
        title="Substituir todos os dados?"
        description="Ao importar este backup, todos os dados atuais (contas, transações, cartões, categorias e metas) serão substituídos pelos dados do arquivo. Essa ação não pode ser desfeita."
        confirmLabel={importing ? 'Importando...' : 'Substituir dados'}
        destructive
        onConfirm={confirmImport}
      />
    </div>
  )
}
