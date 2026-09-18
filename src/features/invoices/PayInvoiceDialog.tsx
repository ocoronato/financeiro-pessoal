import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { useAccounts } from '@/hooks/useAccounts'
import { payInvoice } from '@/services/invoiceService'
import { toast } from '@/hooks/use-toast'
import { todayISO } from '@/utils/format'
import type { Invoice } from '@/types'

interface PayInvoiceDialogProps {
  invoice?: Invoice
  total: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PayInvoiceDialog({ invoice, total, open, onOpenChange }: PayInvoiceDialogProps) {
  const accounts = useAccounts()
  const [accountId, setAccountId] = useState<number | undefined>()
  const [date, setDate] = useState(todayISO())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (!invoice?.id) return
    if (!accountId) return setError('Selecione a conta de onde o dinheiro vai sair.')

    setSubmitting(true)
    setError(null)
    try {
      await payInvoice(invoice.id, accountId, date)
      toast({ title: 'Fatura paga', variant: 'success' })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível pagar a fatura.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagar fatura</DialogTitle>
          <DialogDescription>O valor será descontado da conta selecionada.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl bg-secondary p-4 text-center">
            <p className="text-xs text-muted-foreground">Valor da fatura</p>
            <MoneyDisplay value={total} size="xl" />
          </div>

          <div className="space-y-1.5">
            <Label>Pagar com qual conta?</Label>
            <Select value={accountId?.toString() ?? ''} onValueChange={(v) => setAccountId(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta" />
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

          <div className="space-y-1.5">
            <Label htmlFor="pay-date">Data do pagamento</Label>
            <Input id="pay-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          {error && <p className="text-sm text-expense">{error}</p>}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={submitting}>
              Confirmar pagamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
