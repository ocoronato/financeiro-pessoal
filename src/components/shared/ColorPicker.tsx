import type { CSSProperties } from 'react'
import { Check } from 'lucide-react'
import { COLOR_PALETTE } from '@/utils/colors'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            'flex size-8 items-center justify-center rounded-full transition-transform hover:scale-110',
            value === color && 'ring-2 ring-offset-2 ring-offset-background',
          )}
          style={{ backgroundColor: color, ...(value === color ? ({ '--tw-ring-color': color } as CSSProperties) : {}) }}
          aria-label={`Selecionar cor ${color}`}
        >
          {value === color && <Check className="size-4 text-white drop-shadow" />}
        </button>
      ))}
    </div>
  )
}
