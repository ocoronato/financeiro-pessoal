import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import type { ThemePreference } from '@/types'

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

export function ThemeSection() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-3 gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors',
            theme === option.value
              ? 'border-primary bg-accent text-accent-foreground'
              : 'border-input text-muted-foreground hover:bg-secondary',
          )}
        >
          <option.icon className="size-5" />
          {option.label}
        </button>
      ))}
    </div>
  )
}
