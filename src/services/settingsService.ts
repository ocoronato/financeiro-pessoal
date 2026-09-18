import { db } from '@/database/db'
import type { AppSettings, ThemePreference } from '@/types'

export const DEFAULT_SETTINGS: AppSettings = { id: 'app', theme: 'system' }

export async function getSettings(): Promise<AppSettings> {
  const settings = await db.settings.get('app')
  return settings ?? DEFAULT_SETTINGS
}

export async function setTheme(theme: ThemePreference) {
  await db.settings.put({ id: 'app', theme })
  try {
    localStorage.setItem('theme-preference', theme)
  } catch {
    // localStorage indisponível (modo privado); tema ainda funciona via Dexie
  }
}
