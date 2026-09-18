export type AccountType = 'corrente' | 'poupanca' | 'dinheiro' | 'investimento' | 'outro'

export interface Account {
  id?: number
  name: string
  type: AccountType
  initialBalance: number
  color: string
  icon: string
  createdAt: string
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  corrente: 'Conta corrente',
  poupanca: 'Poupança',
  dinheiro: 'Dinheiro',
  investimento: 'Investimentos',
  outro: 'Outro',
}
