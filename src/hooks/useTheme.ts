import { useCallback, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import { setTheme as persistTheme } from '@/services/settingsService'
import type { ThemePreference } from '@/types'

function applyTheme(theme: ThemePreference) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export function useTheme() {
  const theme = useLiveQuery(async () => (await db.settings.get('app'))?.theme ?? 'system', [], 'system')

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => applyTheme('system')
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [theme])

  const setTheme = useCallback((next: ThemePreference) => {
    void persistTheme(next)
  }, [])

  return { theme, setTheme }
}
