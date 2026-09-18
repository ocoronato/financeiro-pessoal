import { useEffect } from 'react'
import { db } from '@/database/db'
import { ensureInvoicesExist, refreshInvoiceStatuses } from '@/services/invoiceService'
import { generatePendingRecurringTransactions } from '@/services/recurringService'

export function useAppBootstrap() {
  useEffect(() => {
    async function run() {
      try {
        const cards = await db.creditCards.toArray()
        for (const card of cards) {
          await ensureInvoicesExist(card, 1)
        }
        await refreshInvoiceStatuses()
        await generatePendingRecurringTransactions()
      } catch (error) {
        console.error('Falha ao inicializar dados do aplicativo', error)
      }
    }
    void run()
  }, [])
}
