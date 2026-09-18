import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { ColorPicker } from '@/components/shared/ColorPicker'
import { IconPicker } from '@/components/shared/IconPicker'
import { createGoal, updateGoal } from '@/services/goalService'
import { toast } from '@/hooks/use-toast'
import { COLOR_PALETTE } from '@/utils/colors'
import type { Goal } from '@/types'

interface GoalFormProps {
  editing?: Goal
  onSuccess: () => void
  onCancel: () => void
}

export function GoalForm({ editing, onSuccess, onCancel }: GoalFormProps) {
  const [name, setName] = useState(editing?.name ?? '')
  const [targetAmount, setTargetAmount] = useState(editing?.targetAmount ?? 0)
  const [currentAmount, setCurrentAmount] = useState(editing?.currentAmount ?? 0)
  const [deadline, setDeadline] = useState(editing?.deadline ?? '')
  const [color, setColor] = useState(editing?.color ?? COLOR_PALETTE[5])
  const [icon, setIcon] = useState(editing?.icon ?? 'Target')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Informe um nome para a meta.')
    if (targetAmount <= 0) return setError('Informe um valor objetivo maior que zero.')

    setSubmitting(true)
    setError(null)
    try {
      const data = { name: name.trim(), targetAmount, color, icon, deadline: deadline || undefined }
      if (editing?.id) {
        await updateGoal(editing.id, { ...data, currentAmount })
        toast({ title: 'Meta atualizada', variant: 'success' })
      } else {
        await createGoal({ ...data, currentAmount })
        toast({ title: 'Meta criada', variant: 'success' })
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a meta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="goal-name">Nome</Label>
        <Input
          id="goal-name"
          placeholder="Ex: Reserva de emergência"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="goal-target">Objetivo</Label>
          <CurrencyInput id="goal-target" value={targetAmount} onValueChange={setTargetAmount} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="goal-current">Valor atual</Label>
          <CurrencyInput id="goal-current" value={currentAmount} onValueChange={setCurrentAmount} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="goal-deadline">Prazo (opcional)</Label>
        <Input id="goal-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
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
          {editing ? 'Salvar alterações' : 'Criar meta'}
        </Button>
      </div>
    </form>
  )
}
