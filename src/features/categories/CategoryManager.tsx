import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { CategoryFormDialog } from './CategoryFormDialog'
import { useCategories } from '@/hooks/useCategories'
import { deleteCategory } from '@/services/categoryService'
import { toast } from '@/hooks/use-toast'
import type { Category, CategoryKind } from '@/types'

function CategoryList({ kind }: { kind: CategoryKind }) {
  const categories = useCategories(kind)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | undefined>()
  const [deleting, setDeleting] = useState<Category | undefined>()

  async function confirmDelete() {
    if (!deleting?.id) return
    try {
      await deleteCategory(deleting.id)
      toast({ title: 'Categoria excluída', variant: 'success' })
    } catch (err) {
      toast({
        title: 'Não foi possível excluir',
        description: err instanceof Error ? err.message : undefined,
        variant: 'destructive',
      })
    } finally {
      setDeleting(undefined)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditing(undefined)
            setFormOpen(true)
          }}
        >
          <Plus className="size-4" />
          Nova categoria
        </Button>
      </div>
      <div className="divide-y divide-border rounded-2xl border border-border">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between gap-2 px-4 py-3">
            <CategoryBadge category={category} />
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setEditing(category)
                  setFormOpen(true)
                }}
              >
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(category)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhuma categoria nesta lista.</p>
        )}
      </div>

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} defaultKind={kind} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir categoria?"
        description={`Tem certeza que deseja excluir "${deleting?.name}"?`}
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export function CategoryManager() {
  return (
    <Tabs defaultValue="despesa">
      <TabsList>
        <TabsTrigger value="despesa">Despesas</TabsTrigger>
        <TabsTrigger value="receita">Receitas</TabsTrigger>
      </TabsList>
      <TabsContent value="despesa">
        <CategoryList kind="despesa" />
      </TabsContent>
      <TabsContent value="receita">
        <CategoryList kind="receita" />
      </TabsContent>
    </Tabs>
  )
}
