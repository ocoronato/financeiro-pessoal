import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import type { TransactionStatus, TransactionType } from '@/types'

export interface TransactionFilterState {
  search: string
  type: TransactionType | 'todos'
  categoryId: number | 'todos'
  accountId: number | 'todos'
  status: TransactionStatus | 'todos'
}

export const DEFAULT_FILTERS: TransactionFilterState = {
  search: '',
  type: 'todos',
  categoryId: 'todos',
  accountId: 'todos',
  status: 'todos',
}

interface TransactionFiltersProps {
  value: TransactionFilterState
  onChange: (value: TransactionFilterState) => void
}

export function TransactionFilters({ value, onChange }: TransactionFiltersProps) {
  const accounts = useAccounts()
  const categories = useCategories()

  const hasActiveFilters =
    value.type !== 'todos' || value.categoryId !== 'todos' || value.accountId !== 'todos' || value.status !== 'todos'

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por descrição..."
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={value.type} onValueChange={(v) => onChange({ ...value, type: v as TransactionFilterState['type'] })}>
          <SelectTrigger className="w-auto min-w-32 flex-1 sm:flex-none">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="receita">Receita</SelectItem>
            <SelectItem value="despesa">Despesa</SelectItem>
            <SelectItem value="transferencia">Transferência</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(value.categoryId)}
          onValueChange={(v) => onChange({ ...value, categoryId: v === 'todos' ? 'todos' : Number(v) })}
        >
          <SelectTrigger className="w-auto min-w-32 flex-1 sm:flex-none">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as categorias</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(value.accountId)}
          onValueChange={(v) => onChange({ ...value, accountId: v === 'todos' ? 'todos' : Number(v) })}
        >
          <SelectTrigger className="w-auto min-w-32 flex-1 sm:flex-none">
            <SelectValue placeholder="Conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as contas</SelectItem>
            {accounts.map((a) => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.status} onValueChange={(v) => onChange({ ...value, status: v as TransactionFilterState['status'] })}>
          <SelectTrigger className="w-auto min-w-32 flex-1 sm:flex-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={() => onChange({ ...DEFAULT_FILTERS, search: value.search })}>
            <X className="size-4" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
