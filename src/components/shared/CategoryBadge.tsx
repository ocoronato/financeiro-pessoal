import { getIcon } from '@/utils/icons'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryBadgeProps {
  category?: Category
  size?: 'sm' | 'md'
  className?: string
}

export function CategoryBadge({ category, size = 'md', className }: CategoryBadgeProps) {
  const Icon = getIcon(category?.icon)
  const color = category?.color ?? '#78716c'
  const iconBox = size === 'sm' ? 'size-6' : 'size-8'
  const iconSize = size === 'sm' ? 'size-3.5' : 'size-4'

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span
        className={cn('flex shrink-0 items-center justify-center rounded-full', iconBox)}
        style={{ backgroundColor: `${color}22`, color }}
      >
        <Icon className={iconSize} />
      </span>
      <span className={cn('truncate', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {category?.name ?? 'Sem categoria'}
      </span>
    </div>
  )
}
