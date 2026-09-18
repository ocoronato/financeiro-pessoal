import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAccounts } from '@/hooks/useAccounts'
import { useCreditCards } from '@/hooks/useCreditCards'
import { useCategories } from '@/hooks/useCategories'
import { createRecurring, updateRecurring } from '@/services/recurringService'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import type { RecurringKind, RecurringTransaction } from '@/types'

interface RecurringFormProps {
  editing?: RecurringTransaction
  defaultKind?: RecurringKind
  onSuccess: () => void
  onCancel: () => void
}

export function RecurringForm({ editing, defaultKind = 'despesa', onSuccess, onCancel }: RecurringFormProps) {
  const [kind, setKind] = useState<RecurringKind>(editing?.kind ?? defaultKind)
  const [description, setDescription] = useState(editing?.description ?? '')
  const [amount, setAmount] = useState(editing?.amount ?? 0)
  const [categoryId, setCategoryId] = useState<number | undefined>(editing?.categoryId)
  const [dayOfMonth, setDayOfMonth] = useState(editing?.dayOfMonth ?? 5)
  const [paymentMethod, setPaymentMethod] = useState<'conta' | 'cartao'>(editing?.cardId ? 'cartao' : 'conta')
  const [accountId, setAccountId] = useState<number | undefined>(editing?.accountId)
  const [cardId, setCardId] = useState<number | undefined>(editing?.cardId)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accounts = useAccounts()
  const cards = useCreditCards()
  const categories = useCategories(kind)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return setError('Informe uma descrição.')
    if (amount <= 0) return setError('Informe um valor maior que zero.')
    if (!categoryId) return setError('Selecione uma categoria.')
    if (paymentMethod === 'conta' && !accountId) return setError('Selecione uma conta.')
    if (paymentMethod === 'cartao' && !cardId) return setError('Selecione um cartão.')

    setSubmitting(true)
    setError(null)
    try {
      const data = {
        kind,
        description: description.trim(),
        amount,
        categoryId,
        dayOfMonth,
        accountId: paymentMethod === 'conta' ? accountId : undefined,
        cardId: paymentMethod === 'cartao' ? cardId : undefined,
      }
      if (editing?.id) {
        await updateRecurring(editing.id, data)
        toast({ title: 'Recorrência atualizada', variant: 'success' })
      } else {
        await createRecurring(data)
        toast({ title: 'Recorrência criada', variant: 'success' })
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {(['despesa', 'receita'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setKind(k)
              setCategoryId(undefined)
            }}
            className={cn(
              'rounded-xl border py-2.5 text-sm font-medium transition-colors',
              kind === k
                ? k === 'despesa'
                  ? 'border-expense/30 bg-expense/10 text-expense'
                  : 'border-income/30 bg-income/10 text-income'
                : 'border-input text-muted-foreground hover:bg-secondary',
            )}
          >
            {k === 'despesa' ? 'Despesa' : 'Receita'}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rec-desc">Descrição</Label>
        <Input
          id="rec-desc"
          placeholder="Ex: Netflix, Salário, Academia..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="rec-amount">Valor</Label>
          <CurrencyInput id="rec-amount" value={amount} onValueChange={setAmount} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rec-day">Dia do mês</Label>
          <Input
            id="rec-day"
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Categoria</Label>
        <Select value={categoryId?.toString() ?? ''} onValueChange={(v) => setCategoryId(Number(v))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {kind === 'despesa' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('conta')}
            className={cn(
              'rounded-xl border py-2 text-sm font-medium transition-colors',
              paymentMethod === 'conta' ? 'border-primary bg-accent text-accent-foreground' : 'border-input text-muted-foreground hover:bg-secondary',
            )}
          >
            Conta
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('cartao')}
            className={cn(
              'rounded-xl border py-2 text-sm font-medium transition-colors',
              paymentMethod === 'cartao' ? 'border-primary bg-accent text-accent-foreground' : 'border-input text-muted-foreground hover:bg-secondary',
            )}
          >
            Cartão
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>{paymentMethod === 'cartao' && kind === 'despesa' ? 'Cartão' : 'Conta'}</Label>
        {paymentMethod === 'cartao' && kind === 'despesa' ? (
          <Select value={cardId?.toString() ?? ''} onValueChange={(v) => setCardId(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cartão" />
            </SelectTrigger>
            <SelectContent>
              {cards.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
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
        )}
      </div>

      {error && <p className="text-sm text-expense">{error}</p>}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {editing ? 'Salvar alterações' : 'Criar recorrência'}
        </Button>
      </div>
    </form>
  )
}
