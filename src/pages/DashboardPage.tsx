import { useState } from 'react'
import { LayoutDashboard, ListChecks, Receipt, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TransactionCard } from '@/features/transactions/TransactionCard'
import { SummaryCards } from '@/features/dashboard/SummaryCards'
import { IncomeExpenseChart } from '@/features/dashboard/IncomeExpenseChart'
import { CategoryBreakdownChart } from '@/features/dashboard/CategoryBreakdownChart'
import { GoalsSummary } from '@/features/dashboard/GoalsSummary'
import { useDashboardData } from '@/features/dashboard/useDashboardData'
import { useTransactionDialog } from '@/features/transactions/TransactionDialogProvider'
import { duplicateTransaction, deleteTransaction, toggleTransactionStatus } from '@/services/transactionService'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import type { Account, Category, CreditCard, Transaction } from '@/types'

function TransactionMiniList({
  transactions,
  emptyMessage,
  categoryMap,
  accountMap,
  cardMap,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[]
  emptyMessage: string
  categoryMap: Map<number | undefined, Category>
  accountMap: Map<number | undefined, Account>
  cardMap: Map<number | undefined, CreditCard>
  onEdit: (t: Transaction) => void
  onDelete: (t: Transaction) => void
}) {
  if (transactions.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>
  }
  return (
    <div className="space-y-2">
      {transactions.map((t) => (
        <TransactionCard
          key={t.id}
          transaction={t}
          category={categoryMap.get(t.categoryId)}
          account={accountMap.get(t.accountId)}
          toAccount={accountMap.get(t.toAccountId)}
          card={cardMap.get(t.cardId)}
          onEdit={() => onEdit(t)}
          onDuplicate={async () => {
            if (!t.id) return
            await duplicateTransaction(t.id)
            toast({ title: 'Transação duplicada', variant: 'success' })
          }}
          onDelete={() => onDelete(t)}
          onToggleStatus={() => t.id && toggleTransactionStatus(t.id, t.status === 'pago' ? 'pendente' : 'pago')}
        />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const data = useDashboardData()
  const { openCreate, openEdit } = useTransactionDialog()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState<Transaction | undefined>()

  const categoryMap = new Map(data.categories.map((c) => [c.id, c]))
  const accountMap = new Map(data.accounts.map((a) => [a.id, a]))
  const cardMap = new Map(data.cards.map((c) => [c.id, c]))

  if (data.accounts.length === 0) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Sua visão geral financeira." />
        <EmptyState
          icon={LayoutDashboard}
          title="Vamos começar"
          description="Adicione sua primeira conta para ver seu saldo, receitas e despesas aqui."
          actionLabel="Adicionar primeira conta"
          onAction={() => navigate('/contas')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        title="Dashboard"
        description="Sua visão geral financeira."
        action={<Button onClick={() => openCreate()}>Nova transação</Button>}
      />

      <SummaryCards
        totalBalance={data.totalBalance}
        accountsCount={data.accounts.length}
        monthlyIncome={data.monthlyIncome}
        monthlyExpense={data.monthlyExpense}
        monthlyBalance={data.monthlyBalance}
        upcomingInvoicesTotal={data.upcomingInvoicesTotal}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receitas x despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={data.trend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos por categoria (este mês)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.categoryBreakdown.length === 0 ? (
              <EmptyState icon={TrendingDown} title="Sem despesas neste mês ainda" />
            ) : (
              <CategoryBreakdownChart data={data.categoryBreakdown} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas transações</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionMiniList
              transactions={data.recentTransactions}
              emptyMessage="Nenhuma transação ainda."
              categoryMap={categoryMap}
              accountMap={accountMap}
              cardMap={cardMap}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maiores gastos do mês</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionMiniList
              transactions={data.topExpenses}
              emptyMessage="Nenhuma despesa neste mês."
              categoryMap={categoryMap}
              accountMap={accountMap}
              cardMap={cardMap}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-4" /> Próximas contas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionMiniList
              transactions={data.upcomingBills}
              emptyMessage="Nenhuma conta pendente."
              categoryMap={categoryMap}
              accountMap={accountMap}
              cardMap={cardMap}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="size-4" /> Metas financeiras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoalsSummary goals={data.goals} />
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir transação?"
        description={`Tem certeza que deseja excluir "${deleting?.description}"?`}
        confirmLabel="Excluir"
        destructive
        onConfirm={async () => {
          if (!deleting?.id) return
          await deleteTransaction(deleting.id)
          toast({ title: 'Transação excluída', variant: 'success' })
          setDeleting(undefined)
        }}
      />
    </div>
  )
}
