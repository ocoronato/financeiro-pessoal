import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  CreditCard,
  Receipt,
  Target,
  PieChart,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transacoes', label: 'Transações', icon: ArrowLeftRight },
  { to: '/contas', label: 'Contas', icon: Wallet },
  { to: '/cartoes', label: 'Cartões', icon: CreditCard },
  { to: '/faturas', label: 'Faturas', icon: Receipt },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/relatorios', label: 'Relatórios', icon: PieChart },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export const MOBILE_TAB_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
]

export const MOBILE_MORE_ITEMS: NavItem[] = [NAV_ITEMS[4], NAV_ITEMS[5], NAV_ITEMS[6], NAV_ITEMS[7]]
