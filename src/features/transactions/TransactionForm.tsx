import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAccounts } from '@/hooks/useAccounts'
import { useCreditCards } from '@/hooks/useCreditCards'
import { useCategories } from '@/hooks/useCategories'
import { createTransaction, updateTransaction, type TransactionFormInput } from '@/services/transactionService'
import { toast } from '@/hooks/use-toast'
import { todayISO } from '@/utils/format'
import { cn } from '@/lib/utils'
import type { Transaction, TransactionStatus, TransactionType } from '@/types'

interface TransactionFormProps {
  editing?: Transaction
  defaultType?: TransactionType
  defaultAccountId?: number
  onSuccess: () => void
  onCancel: () => void
}

interface FormState {
  type: 'receita' | 'despesa'
  description: string
  amount: number
  date: string
  categoryId: number | undefined
  paymentMethod: 'conta' | 'cartao'
  accountId: number | undefined
  cardId: number | undefined
  installments: number
  status: TransactionStatus
  note: string
}

function buildInitialState(editing?: Transaction, defaultType?: TransactionType, defaultAccountId?: number): FormState {
  if (editing && editing.type !== 'transferencia') {
    return {
      type: editing.type,
      description: editing.description,
      amount: editing.amount,
      date: editing.date,
      categoryId: editing.categoryId,
      paymentMethod: editing.cardId ? 'cartao' : 'conta',
      accountId: editing.accountId,
      cardId: editing.cardId,
      installments: editing.installmentTotal ?? 1,
      status: editing.status,
      note: editing.note ?? '',
    }
  }
  return {
    type: defaultType === 'receita' ? 'receita' : 'despesa',
    description: '',
    amount: 0,
    date: todayISO(),
    categoryId: undefined,
    paymentMethod: 'conta',
    accountId: defaultAccountId,
    cardId: undefined,
    installments: 1,
    status: 'pago',
    note: '',
  }
}

export function TransactionForm({ editing, defaultType, defaultAccountId, onSuccess, onCancel }: TransactionFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(editing, defaultType, defaultAccountId))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accounts = useAccounts()
  const cards = useCreditCards()
  const categories = useCategories(form.type)

  const isInstallmentTransaction = Boolean(editing?.installmentGroupId)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleTypeChange(type: 'receita' | 'despesa') {
    setForm((prev) => ({
      ...prev,
      type,
      categoryId: undefined,
      paymentMethod: type === 'receita' ? 'conta' : prev.paymentMethod,
      cardId: type === 'receita' ? undefined : prev.cardId,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.description.trim()) return setError('Informe uma descrição.')
    if (form.amount <= 0) return setError('Informe um valor maior que zero.')
    if (!form.categoryId) return setError('Selecione uma categoria.')
    if (form.paymentMethod === 'conta' && !form.accountId) return setError('Selecione uma conta.')
    if (form.paymentMethod === 'cartao' && !form.cardId) return setError('Selecione um cartão.')

    const input: TransactionFormInput = {
      type: form.type,
      description: form.description.trim(),
      amount: form.amount,
      date: form.date,
      categoryId: form.categoryId,
      accountId: form.paymentMethod === 'conta' ? form.accountId : undefined,
      cardId: form.paymentMethod === 'cartao' ? form.cardId : undefined,
      installments: form.paymentMethod === 'cartao' && !isInstallmentTransaction ? form.installments : undefined,
      status: form.status,
      note: form.note.trim() || undefined,
    }

    setSubmitting(true)
    try {
      if (editing?.id) {
        await updateTransaction(editing.id, input)
        toast({ title: 'Transação atualizada', variant: 'success' })
      } else {
        await createTransaction(input)
        toast({ title: 'Transação adicionada', variant: 'success' })
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a transação.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {(['despesa', 'receita'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className={cn(
              'rounded-xl border py-2.5 text-sm font-medium transition-colors',
              form.type === t
                ? t === 'despesa'
                  ? 'border-expense/30 bg-expense/10 text-expense'
                  : 'border-income/30 bg-income/10 text-income'
                : 'border-input text-muted-foreground hover:bg-secondary',
            )}
          >
            {t === 'despesa' ? 'Despesa' : 'Receita'}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tx-description">Descrição</Label>
        <Input
          id="tx-description"
          placeholder="Ex: Supermercado, Uber, Salário..."
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="tx-amount">Valor</Label>
          <CurrencyInput id="tx-amount" value={form.amount} onValueChange={(v) => update('amount', v)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tx-date">Data</Label>
          <Input id="tx-date" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Categoria</Label>
        <Select value={form.categoryId?.toString() ?? ''} onValueChange={(v) => update('categoryId', Number(v))}>
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

      {form.type === 'despesa' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => update('paymentMethod', 'conta')}
            className={cn(
              'rounded-xl border py-2 text-sm font-medium transition-colors',
              form.paymentMethod === 'conta' ? 'border-primary bg-accent text-accent-foreground' : 'border-input text-muted-foreground hover:bg-secondary',
            )}
          >
            Conta
          </button>
          <button
            type="button"
            disabled={isInstallmentTransaction}
            onClick={() => update('paymentMethod', 'cartao')}
            className={cn(
              'rounded-xl border py-2 text-sm font-medium transition-colors disabled:opacity-50',
              form.paymentMethod === 'cartao' ? 'border-primary bg-accent text-accent-foreground' : 'border-input text-muted-foreground hover:bg-secondary',
            )}
          >
            Cartão
          </button>
        </div>
      )}

      {form.paymentMethod === 'conta' ? (
        <div className="space-y-1.5">
          <Label>Conta</Label>
          <Select value={form.accountId?.toString() ?? ''} onValueChange={(v) => update('accountId', Number(v))}>
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
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Cartão</Label>
            <Select
              value={form.cardId?.toString() ?? ''}
              onValueChange={(v) => update('cardId', Number(v))}
              disabled={isInstallmentTransaction}
            >
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
          </div>

          {isInstallmentTransaction ? (
            <p className="text-xs text-muted-foreground">
              Parcela {editing?.installmentNumber} de {editing?.installmentTotal}. Para alterar o parcelamento, exclua e
              lance a compra novamente.
            </p>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="tx-installments">Parcelas</Label>
              <Select value={String(form.installments)} onValueChange={(v) => update('installments', Number(v))}>
                <SelectTrigger id="tx-installments">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n === 1 ? 'À vista' : `${n}x de ${(form.amount / n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {form.paymentMethod === 'conta' && (
        <div className="space-y-1.5">
          <Label>Situação</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['pendente', 'pago'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update('status', s)}
                className={cn(
                  'rounded-xl border py-2 text-sm font-medium transition-colors',
                  form.status === s ? 'border-primary bg-accent text-accent-foreground' : 'border-input text-muted-foreground hover:bg-secondary',
                )}
              >
                {s === 'pago' ? 'Pago' : 'Pendente'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="tx-note">Observação (opcional)</Label>
        <Textarea id="tx-note" value={form.note} onChange={(e) => update('note', e.target.value)} rows={2} />
      </div>

      {error && <p className="text-sm text-expense">{error}</p>}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {editing ? 'Salvar alterações' : 'Adicionar transação'}
        </Button>
      </div>
    </form>
  )
}
