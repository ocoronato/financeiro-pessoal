import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAccounts } from '@/hooks/useAccounts'
import { createTransfer } from '@/services/transactionService'
import { toast } from '@/hooks/use-toast'
import { todayISO } from '@/utils/format'

interface TransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransferDialog({ open, onOpenChange }: TransferDialogProps) {
  const accounts = useAccounts()
  const [fromAccountId, setFromAccountId] = useState<number | undefined>()
  const [toAccountId, setToAccountId] = useState<number | undefined>()
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState(todayISO())
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setFromAccountId(undefined)
    setToAccountId(undefined)
    setAmount(0)
    setDate(todayISO())
    setDescription('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fromAccountId || !toAccountId) return setError('Selecione as duas contas.')
    if (fromAccountId === toAccountId) return setError('Selecione contas diferentes.')
    if (amount <= 0) return setError('Informe um valor maior que zero.')

    setSubmitting(true)
    setError(null)
    try {
      await createTransfer({ fromAccountId, toAccountId, amount, date, description })
      toast({ title: 'Transferência realizada', variant: 'success' })
      reset()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível transferir.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferência entre contas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1.5">
              <Label>De</Label>
              <Select value={fromAccountId?.toString() ?? ''} onValueChange={(v) => setFromAccountId(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ArrowRight className="mt-5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex-1 space-y-1.5">
              <Label>Para</Label>
              <Select value={toAccountId?.toString() ?? ''} onValueChange={(v) => setToAccountId(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Destino" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="transfer-amount">Valor</Label>
              <CurrencyInput id="transfer-amount" value={amount} onValueChange={setAmount} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="transfer-date">Data</Label>
              <Input id="transfer-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="transfer-desc">Descrição (opcional)</Label>
            <Input
              id="transfer-desc"
              placeholder="Ex: Reserva de emergência"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Essa movimentação não entra no total de receitas ou despesas — apenas move o dinheiro entre suas contas.
          </p>

          {error && <p className="text-sm text-expense">{error}</p>}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              Transferir
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
