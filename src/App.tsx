import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { TransactionDialogProvider } from '@/features/transactions/TransactionDialogProvider'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'))
const AccountsPage = lazy(() => import('@/pages/AccountsPage'))
const CardsPage = lazy(() => import('@/pages/CardsPage'))
const InvoicesPage = lazy(() => import('@/pages/InvoicesPage'))
const GoalsPage = lazy(() => import('@/pages/GoalsPage'))
const ReportsPage = lazy(() => import('@/pages/ReportsPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

function PageFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <TransactionDialogProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="transacoes" element={<TransactionsPage />} />
              <Route path="contas" element={<AccountsPage />} />
              <Route path="cartoes" element={<CardsPage />} />
              <Route path="faturas" element={<InvoicesPage />} />
              <Route path="metas" element={<GoalsPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </TransactionDialogProvider>
    </HashRouter>
  )
}
