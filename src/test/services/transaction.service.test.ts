import { describe, it, expect } from 'vitest';
import { normalizeTransaction, buildParams } from '@/services/transaction.service';
import type { Transaction } from '@/interfaces/Transaction';

const baseTransaction: Transaction = {
  id: 1,
  type: 'expense',
  amount: 42.5,
  notes: null,
  accountId: 10,
  categoryId: 5,
  categoryName: 'Food',
  categoryIcon: 'utensils',
  categoryColor: '#ff0000',
  createdAt: '2026-09-15T10:00:00.000Z',
};

describe('normalizeTransaction', () => {
  it('coerces a string amount to a float', () => {
    const t = { ...baseTransaction, amount: '42.5' as unknown as number };
    expect(normalizeTransaction(t).amount).toBe(42.5);
  });

  it('coerces "0" to 0, not NaN', () => {
    const t = { ...baseTransaction, amount: '0' as unknown as number };
    expect(normalizeTransaction(t).amount).toBe(0);
    expect(isNaN(normalizeTransaction(t).amount)).toBe(false);
  });

  it('leaves a numeric amount unchanged', () => {
    expect(normalizeTransaction(baseTransaction).amount).toBe(42.5);
  });

  it('lowercases the type field', () => {
    const t = { ...baseTransaction, type: 'Expense' as unknown as 'expense' };
    expect(normalizeTransaction(t).type).toBe('expense');
  });

  it('preserves notes: null', () => {
    expect(normalizeTransaction(baseTransaction).notes).toBeNull();
  });

  it('preserves notes when present', () => {
    const t = { ...baseTransaction, notes: 'lunch' };
    expect(normalizeTransaction(t).notes).toBe('lunch');
  });

  it('preserves accountId as a number', () => {
    expect(normalizeTransaction(baseTransaction).accountId).toBe(10);
  });

  it('returns NaN for null amount', () => {
    const t = { ...baseTransaction, amount: null as unknown as number };
    expect(isNaN(normalizeTransaction(t).amount)).toBe(true);
  });

  it('returns NaN for undefined amount', () => {
    const t = { ...baseTransaction, amount: undefined as unknown as number };
    expect(isNaN(normalizeTransaction(t).amount)).toBe(true);
  });

  it('returns NaN for empty string amount', () => {
    const t = { ...baseTransaction, amount: '' as unknown as number };
    expect(isNaN(normalizeTransaction(t).amount)).toBe(true);
  });

  it('returns NaN for non-numeric string amount', () => {
    const t = { ...baseTransaction, amount: 'abc' as unknown as number };
    expect(isNaN(normalizeTransaction(t).amount)).toBe(true);
  });

  it('does not produce "undefined" string for missing type', () => {
    const t = { ...baseTransaction, type: undefined as unknown as TransactionType };
    expect(normalizeTransaction(t).type).not.toBe('undefined');
  });
});

describe('buildParams', () => {
  it('returns an empty object when no arguments given', () => {
    expect(buildParams()).toEqual({});
  });

  it('includes cursor when provided', () => {
    expect(buildParams('abc123')).toEqual({ cursor: 'abc123' });
  });

  it('omits undefined filter fields', () => {
    const result = buildParams(null, { type: undefined, categoryId: undefined });
    expect(result).toEqual({});
  });

  it('includes type when provided', () => {
    expect(buildParams(null, { type: 'expense' })).toEqual({ type: 'expense' });
  });

  it('includes categoryId when provided', () => {
    expect(buildParams(null, { categoryId: 3 })).toEqual({ categoryId: 3 });
  });

  it('includes startDate and endDate when provided', () => {
    const result = buildParams(null, { startDate: '2026-01-01', endDate: '2026-01-31' });
    expect(result).toEqual({ startDate: '2026-01-01', endDate: '2026-01-31' });
  });

  it('includes minAmount and maxAmount when provided', () => {
    const result = buildParams(null, { minAmount: 10, maxAmount: 100 });
    expect(result).toEqual({ minAmount: 10, maxAmount: 100 });
  });

  it('combines cursor and filters', () => {
    const result = buildParams('cur_1', { type: 'income', categoryId: 7 });
    expect(result).toEqual({ cursor: 'cur_1', type: 'income', categoryId: 7 });
  });
});
