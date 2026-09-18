import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ICON_NAMES, getIcon } from '@/utils/icons'
import { cn } from '@/lib/utils'

interface IconPickerProps {
  value: string
  onChange: (icon: string) => void
  color?: string
}

export function IconPicker({ value, onChange, color = '#78716c' }: IconPickerProps) {
  const [search, setSearch] = useState('')

  const filtered = search
    ? ICON_NAMES.filter((name) => name.toLowerCase().includes(search.toLowerCase()))
    : ICON_NAMES

  return (
    <div className="space-y-2">
      <Input
        placeholder="Buscar ícone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9"
      />
      <div className="grid max-h-48 grid-cols-7 gap-1.5 overflow-y-auto rounded-xl border border-border p-2 sm:grid-cols-9">
        {filtered.map((name) => {
          const Icon = getIcon(name)
          const selected = value === name
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              className={cn(
                'flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-secondary',
                selected && 'ring-2',
              )}
              style={selected ? { backgroundColor: `${color}22`, color } : undefined}
              aria-label={name}
            >
              <Icon className="size-4" />
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-4 text-center text-xs text-muted-foreground">Nenhum ícone encontrado</p>
        )}
      </div>
    </div>
  )
}
