import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/shared/ColorPicker'
import { IconPicker } from '@/components/shared/IconPicker'
import { createCategory, updateCategory } from '@/services/categoryService'
import { toast } from '@/hooks/use-toast'
import { COLOR_PALETTE } from '@/utils/colors'
import type { Category, CategoryKind } from '@/types'

interface CategoryFormProps {
  editing?: Category
  defaultKind?: CategoryKind
  onSuccess: () => void
  onCancel: () => void
}

export function CategoryForm({ editing, defaultKind = 'despesa', onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(editing?.name ?? '')
  const [kind, setKind] = useState<CategoryKind>(editing?.kind ?? defaultKind)
  const [color, setColor] = useState(editing?.color ?? COLOR_PALETTE[0])
  const [icon, setIcon] = useState(editing?.icon ?? 'Tag')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Informe um nome para a categoria.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      if (editing?.id) {
        await updateCategory(editing.id, { name: name.trim(), kind, color, icon })
        toast({ title: 'Categoria atualizada', variant: 'success' })
      } else {
        await createCategory({ name: name.trim(), kind, color, icon })
        toast({ title: 'Categoria criada', variant: 'success' })
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a categoria.')
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
            onClick={() => setKind(k)}
            className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
              kind === k
                ? k === 'despesa'
                  ? 'border-expense/30 bg-expense/10 text-expense'
                  : 'border-income/30 bg-income/10 text-income'
                : 'border-input text-muted-foreground hover:bg-secondary'
            }`}
          >
            {k === 'despesa' ? 'Despesa' : 'Receita'}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-name">Nome</Label>
        <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
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
          {editing ? 'Salvar alterações' : 'Criar categoria'}
        </Button>
      </div>
    </form>
  )
}
