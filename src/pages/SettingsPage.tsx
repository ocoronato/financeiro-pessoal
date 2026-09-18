import { ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ThemeSection } from '@/features/settings/ThemeSection'
import { BackupSection } from '@/features/settings/BackupSection'
import { DangerZoneSection } from '@/features/settings/DangerZoneSection'
import { CategoryManager } from '@/features/categories/CategoryManager'
import { RecurringList } from '@/features/recurring/RecurringList'

export default function SettingsPage() {
  return (
    <div className="space-y-5 pb-4">
      <PageHeader title="Configurações" description="Personalize o aplicativo e gerencie seus dados." />

      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>Escolha o tema do aplicativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSection />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>Gerencie as categorias de receitas e despesas.</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryManager />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contas e receitas recorrentes</CardTitle>
          <CardDescription>Lançamentos automáticos todo mês, como aluguel, assinaturas ou salário.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecurringList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup e exportação</CardTitle>
          <CardDescription>Seus dados ficam só neste dispositivo — faça backups com frequência.</CardDescription>
        </CardHeader>
        <CardContent>
          <BackupSection />
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-accent/40">
        <CardContent className="flex items-start gap-3 p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm text-accent-foreground">
            Nenhum dado financeiro é enviado para servidores externos. Tudo é armazenado localmente no seu
            navegador, sem contas, login ou rastreamento.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-medium text-expense">Zona de risco</h2>
        <DangerZoneSection />
      </div>
    </div>
  )
}
