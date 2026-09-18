export type CategoryKind = 'receita' | 'despesa'

export interface Category {
  id?: number
  name: string
  kind: CategoryKind
  icon: string
  color: string
  isDefault: boolean
}
