import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { ColorPicker } from '@/components/shared/ColorPicker'
import { createCreditCard, updateCreditCard } from '@/services/creditCardService'
import { toast } from '@/hooks/use-toast'
import { COLOR_PALETTE } from '@/utils/colors'
import type { CreditCard } from '@/types'

interface CreditCardFormProps {
  editing?: CreditCard
  onSuccess: () => void
  onCancel: () => void
}

export function CreditCardForm({ editing, onSuccess, onCancel }: CreditCardFormProps) {
  const [name, setName] = useState(editing?.name ?? '')
  const [bank, setBank] = useState(editing?.bank ?? '')
  const [limit, setLimit] = useState(editing?.limit ?? 0)
  const [closingDay, setClosingDay] = useState(editing?.closingDay ?? 1)
  const [dueDay, setDueDay] = useState(editing?.dueDay ?? 10)
  const [color, setColor] = useState(editing?.color ?? COLOR_PALETTE[11])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Informe um nome para o cartão.')
    if (closingDay < 1 || closingDay > 31 || dueDay < 1 || dueDay > 31) {
      return setError('Os dias de fechamento e vencimento devem estar entre 1 e 31.')
    }

    setSubmitting(true)
    setError(null)
    try {
      const data = { name: name.trim(), bank: bank.trim(), limit, closingDay, dueDay, color }
      if (editing?.id) {
        await updateCreditCard(editing.id, data)
        toast({ title: 'Cartão atualizado', variant: 'success' })
      } else {
        await createCreditCard(data)
        toast({ title: 'Cartão criado', variant: 'success' })
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o cartão.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="card-name">Nome</Label>
          <Input id="card-name" placeholder="Ex: Nubank Ultravioleta" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="card-bank">Banco</Label>
          <Input id="card-bank" placeholder="Ex: Nubank" value={bank} onChange={(e) => setBank(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="card-limit">Limite</Label>
        <CurrencyInput id="card-limit" value={limit} onValueChange={setLimit} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="card-closing">Dia de fechamento</Label>
          <Input
            id="card-closing"
            type="number"
            min={1}
            max={31}
            value={closingDay}
            onChange={(e) => setClosingDay(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="card-due">Dia de vencimento</Label>
          <Input
            id="card-due"
            type="number"
            min={1}
            max={31}
            value={dueDay}
            onChange={(e) => setDueDay(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Cor</Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      {error && <p className="text-sm text-expense">{error}</p>}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {editing ? 'Salvar alterações' : 'Criar cartão'}
        </Button>
      </div>
    </form>
  )
}
