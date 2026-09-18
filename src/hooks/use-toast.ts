import { useEffect, useState } from 'react'

export type ToastVariant = 'default' | 'success' | 'destructive'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

type Listener = (toasts: ToastItem[]) => void

let toasts: ToastItem[] = []
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((listener) => listener(toasts))
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export function toast(item: Omit<ToastItem, 'id'>): string {
  const id = crypto.randomUUID()
  toasts = [...toasts, { ...item, id }]
  emit()
  setTimeout(() => dismissToast(id), 4000)
  return id
}

export function useToasts(): ToastItem[] {
  const [state, setState] = useState(toasts)

  useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])

  return state
}
