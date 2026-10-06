import { describe, expect, it } from 'vitest';
import type { Transaction } from '@/interfaces/Transaction';
import { buildTopCategories, groupTransactionsByDay } from '@/shared/transactions';

const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 1,
  type: 'expense',
  amount: 10,
  notes: null,
  accountId: 1,
  categoryId: 1,
  categoryName: 'Food',
  categoryIcon: 'utensils',
  categoryColor: '#ff0000',
  createdAt: '2024-01-15T12:00:00.000Z',
  ...overrides,
});

describe('buildTopCategories()', () => {
  it('sums amounts for the same categoryId correctly', () => {
    const txs = [
      makeTransaction({ categoryId: 1, amount: 30 }),
      makeTransaction({ categoryId: 1, amount: 20 }),
      makeTransaction({ categoryId: 2, amount: 50 }),
    ];

    const { categories, total } = buildTopCategories(txs);

    expect(total).toBe(100);
    const cat1 = categories.find((c) => c.categoryId === 1)!;
    expect(cat1.amount).toBe(50);
  });

  it('returns categories sorted by descending spend, up to limit', () => {
    const txs = [
      makeTransaction({ categoryId: 1, amount: 10 }),
      makeTransaction({ categoryId: 2, amount: 40 }),
      makeTransaction({ categoryId: 3, amount: 20 }),
      makeTransaction({ categoryId: 4, amount: 30 }),
    ];

    const { categories } = buildTopCategories(txs, 3);

    expect(categories).toHaveLength(3);
    expect(categories.map((c) => c.categoryId)).toEqual([2, 4, 3]);
  });

  it('total reflects all expenses, not just the top-N slice', () => {
    const txs = [1, 2, 3, 4, 5].map((id) =>
      makeTransaction({ categoryId: id, amount: id * 10 }),
    );

    const { total, categories } = buildTopCategories(txs, 3);

    expect(total).toBe(150);
    expect(categories).toHaveLength(3);
  });

  it('excludes income transactions from total and categories', () => {
    const txs = [
      makeTransaction({ type: 'expense', amount: 100 }),
      makeTransaction({ type: 'income', amount: 200, categoryId: 2 }),
    ];

    const { total, categories } = buildTopCategories(txs);

    expect(total).toBe(100);
    expect(categories).toHaveLength(1);
    expect(categories[0].categoryId).toBe(1);
  });

  it('returns fewer than limit when fewer categories exist', () => {
    const txs = [
      makeTransaction({ categoryId: 1, amount: 50 }),
      makeTransaction({ categoryId: 2, amount: 30 }),
    ];

    const { categories } = buildTopCategories(txs, 3);

    expect(categories).toHaveLength(2);
  });
});

describe('groupTransactionsByDay()', () => {
  // Timestamps 1 minute apart are guaranteed to fall on the same local calendar
  // day in any timezone. 24-hour separation guarantees different local days.
  const DAY_A_1 = '2024-01-15T12:00:00.000Z';
  const DAY_A_2 = '2024-01-15T12:01:00.000Z';
  const DAY_A_3 = '2024-01-15T12:02:00.000Z';
  const DAY_B   = '2024-01-16T12:00:00.000Z';

  it('groups transactions from the same date into one section', () => {
    const txs = [
      makeTransaction({ id: 1, createdAt: DAY_A_1 }),
      makeTransaction({ id: 2, createdAt: DAY_A_2 }),
    ];

    const sections = groupTransactionsByDay(txs);

    expect(sections).toHaveLength(1);
    expect(sections[0].data).toHaveLength(2);
  });

  it('produces separate sections for different dates', () => {
    const txs = [
      makeTransaction({ id: 1, createdAt: DAY_A_1 }),
      makeTransaction({ id: 2, createdAt: DAY_B }),
    ];

    const sections = groupTransactionsByDay(txs);

    expect(sections).toHaveLength(2);
  });

  it('returns an empty array for empty input', () => {
    expect(groupTransactionsByDay([])).toEqual([]);
  });

  it('preserves within-day insertion order', () => {
    const txs = [
      makeTransaction({ id: 1, createdAt: DAY_A_1 }),
      makeTransaction({ id: 2, createdAt: DAY_A_2 }),
      makeTransaction({ id: 3, createdAt: DAY_A_3 }),
    ];

    const sections = groupTransactionsByDay(txs);

    expect(sections[0].data.map((t) => t.id)).toEqual([1, 2, 3]);
  });
});
