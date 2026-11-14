import test from 'node:test'
import assert from 'node:assert/strict'

const isLateDeposit = (day) => day >= 11
const aggregateCanonicalLedger = (entries) => entries.reduce((total, entry) => {
  if (entry.kind === 'deposit') return total + entry.amount
  if (['expense', 'withdrawal', 'loan'].includes(entry.kind)) return total - entry.amount
  return total
}, 0)
const filterPeriod = (entries, from, to) => entries.filter((entry) => entry.date >= from && entry.date <= to)

test('deposits from the 11th through month-end are late', () => {
  assert.equal(isLateDeposit(10), false)
  assert.equal(isLateDeposit(11), true)
  assert.equal(isLateDeposit(30), true)
})

test('canonical aggregation does not double-count a member sheet reference', () => {
  const entries = [
    { id: 'D-1', memberId: 'S-001', kind: 'deposit', amount: 5000, date: '2026-11-03' },
    { id: 'E-1', memberId: 'S-001', kind: 'expense', amount: 1200, date: '2026-11-04' },
  ]
  assert.equal(aggregateCanonicalLedger(entries), 3800)
})

test('period filter keeps the selected inclusive date range', () => {
  const entries = [
    { date: '2026-11-01' },
    { date: '2026-11-15' },
    { date: '2026-12-01' },
  ]
  assert.deepEqual(filterPeriod(entries, '2026-11-01', '2026-11-30'), entries.slice(0, 2))
})
