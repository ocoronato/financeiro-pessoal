import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { TransactionFormDialog } from './TransactionFormDialog'
import type { Transaction, TransactionType } from '@/types'

interface DialogState {
  open: boolean
  editing?: Transaction
  defaultType?: TransactionType
  defaultAccountId?: number
}

interface TransactionDialogContextValue {
  openCreate: (options?: { type?: TransactionType; accountId?: number }) => void
  openEdit: (transaction: Transaction) => void
}

const TransactionDialogContext = createContext<TransactionDialogContextValue | null>(null)

export function TransactionDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState>({ open: false })

  const value = useMemo<TransactionDialogContextValue>(
    () => ({
      openCreate: (options) =>
        setState({ open: true, editing: undefined, defaultType: options?.type, defaultAccountId: options?.accountId }),
      openEdit: (transaction) => setState({ open: true, editing: transaction }),
    }),
    [],
  )

  return (
    <TransactionDialogContext.Provider value={value}>
      {children}
      <TransactionFormDialog
        open={state.open}
        onOpenChange={(open) => setState((prev) => ({ ...prev, open }))}
        editing={state.editing}
        defaultType={state.defaultType}
        defaultAccountId={state.defaultAccountId}
      />
    </TransactionDialogContext.Provider>
  )
}

export function useTransactionDialog(): TransactionDialogContextValue {
  const ctx = useContext(TransactionDialogContext)
  if (!ctx) throw new Error('useTransactionDialog deve ser usado dentro de TransactionDialogProvider')
  return ctx
}
