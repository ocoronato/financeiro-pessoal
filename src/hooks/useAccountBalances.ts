import { useMemo } from 'react'
import { useAccounts } from './useAccounts'
import { useTransactions } from './useTransactions'
import { useInvoices } from './useInvoices'
import { calculateAccountBalances } from '@/services/accountService'

export function useAccountBalances() {
  const accounts = useAccounts()
  const transactions = useTransactions()
  const invoices = useInvoices()

  const balances = useMemo(
    () => calculateAccountBalances(accounts, transactions, invoices),
    [accounts, transactions, invoices],
  )

  const totalBalance = useMemo(() => {
    let sum = 0
    for (const value of balances.values()) sum += value
    return sum
  }, [balances])

  return { accounts, balances, totalBalance }
}
