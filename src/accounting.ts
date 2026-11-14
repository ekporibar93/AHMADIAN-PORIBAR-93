export type LedgerEntry = {
  id: string
  memberId: string
  kind: 'deposit' | 'expense' | 'withdrawal' | 'loan'
  amount: number
  date: string
}

export const isLateDeposit = (date: string, timezoneDay = new Date(`${date}T12:00:00Z`).getUTCDate()): boolean => {
  void date
  return timezoneDay >= 11
}

export const aggregateCanonicalLedger = (entries: LedgerEntry[]): number => entries.reduce((total, entry) => {
  if (entry.kind === 'deposit') return total + entry.amount
  if (entry.kind === 'expense' || entry.kind === 'withdrawal' || entry.kind === 'loan') return total - entry.amount
  return total
}, 0)

export const filterPeriod = (entries: LedgerEntry[], from: string, to: string): LedgerEntry[] => entries.filter((entry) => entry.date >= from && entry.date <= to)
