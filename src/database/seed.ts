import type { Category } from '@/types'

export const defaultCategories: Category[] = [
  { name: 'Alimentação', kind: 'despesa', icon: 'UtensilsCrossed', color: '#f97316', isDefault: true },
  { name: 'Mercado', kind: 'despesa', icon: 'ShoppingCart', color: '#84cc16', isDefault: true },
  { name: 'Transporte', kind: 'despesa', icon: 'Bus', color: '#0ea5e9', isDefault: true },
  { name: 'Combustível', kind: 'despesa', icon: 'Fuel', color: '#eab308', isDefault: true },
  { name: 'Faculdade', kind: 'despesa', icon: 'GraduationCap', color: '#6366f1', isDefault: true },
  { name: 'Lazer', kind: 'despesa', icon: 'Popcorn', color: '#ec4899', isDefault: true },
  { name: 'Compras', kind: 'despesa', icon: 'ShoppingBag', color: '#a855f7', isDefault: true },
  { name: 'Assinaturas', kind: 'despesa', icon: 'Repeat', color: '#14b8a6', isDefault: true },
  { name: 'Contas', kind: 'despesa', icon: 'Receipt', color: '#64748b', isDefault: true },
  { name: 'Saúde', kind: 'despesa', icon: 'HeartPulse', color: '#ef4444', isDefault: true },
  { name: 'Presentes', kind: 'despesa', icon: 'Gift', color: '#d946ef', isDefault: true },
  { name: 'Pets', kind: 'despesa', icon: 'PawPrint', color: '#f59e0b', isDefault: true },
  { name: 'Outros', kind: 'despesa', icon: 'MoreHorizontal', color: '#78716c', isDefault: true },
  { name: 'Salário', kind: 'receita', icon: 'Banknote', color: '#22c55e', isDefault: true },
  { name: 'Comissão', kind: 'receita', icon: 'Percent', color: '#10b981', isDefault: true },
  { name: 'Freelance', kind: 'receita', icon: 'Laptop', color: '#06b6d4', isDefault: true },
  { name: 'Venda', kind: 'receita', icon: 'Tag', color: '#8b5cf6', isDefault: true },
  { name: 'Investimentos', kind: 'receita', icon: 'TrendingUp', color: '#3b82f6', isDefault: true },
  { name: 'Outros', kind: 'receita', icon: 'MoreHorizontal', color: '#78716c', isDefault: true },
]
