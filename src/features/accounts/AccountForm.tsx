import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { ColorPicker } from '@/components/shared/ColorPicker'
import { IconPicker } from '@/components/shared/IconPicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createAccount, updateAccount } from '@/services/accountService'
import { toast } from '@/hooks/use-toast'
import { COLOR_PALETTE } from '@/utils/colors'
import { ACCOUNT_TYPE_LABELS, type Account, type AccountType } from '@/types'

interface AccountFormProps {
  editing?: Account
  onSuccess: () => void
  onCancel: () => void
}

export function AccountForm({ editing, onSuccess, onCancel }: AccountFormProps) {
  const [name, setName] = useState(editing?.name ?? '')
  const [type, setType] = useState<AccountType>(editing?.type ?? 'corrente')
  const [initialBalance, setInitialBalance] = useState(editing?.initialBalance ?? 0)
  const [color, setColor] = useState(editing?.color ?? COLOR_PALETTE[9])
  const [icon, setIcon] = useState(editing?.icon ?? 'Wallet')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Informe um nome para a conta.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      if (editing?.id) {
        await updateAccount(editing.id, { name: name.trim(), type, initialBalance, color, icon })
        toast({ title: 'Conta atualizada', variant: 'success' })
      } else {
        await createAccount({ name: name.trim(), type, initialBalance, color, icon })
        toast({ title: 'Conta criada', variant: 'success' })
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a conta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="acc-name">Nome</Label>
        <Input
          id="acc-name"
          placeholder="Ex: Nubank, Carteira..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="acc-balance">Saldo inicial</Label>
          <CurrencyInput id="acc-balance" value={initialBalance} onValueChange={setInitialBalance} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Cor</Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div className="space-y-1.5">
        <Label>Ícone</Label>
        <IconPicker value={icon} onChange={setIcon} color={color} />
      </div>

      {error && <p className="text-sm text-expense">{error}</p>}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {editing ? 'Salvar alterações' : 'Criar conta'}
        </Button>
      </div>
    </form>
  )
}
