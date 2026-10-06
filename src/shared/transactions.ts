import { Transaction } from '@/interfaces/Transaction';
import { dayLabel } from '@/shared/dateRange';

export interface CategorySpend {
  categoryId: number;
  name: string;
  icon: string;
  color: string;
  amount: number;
}

/**
 * Aggregates expense transactions by category and returns the top N by spend.
 * Income transactions are excluded.
 */
export const buildTopCategories = (
  transactions: Transaction[],
  limit = 3,
): { total: number; categories: CategorySpend[] } => {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const total = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const byCategory = new Map<number, CategorySpend>();
  for (const tx of expenses) {
    const existing = byCategory.get(tx.categoryId);
    const amount = Number(tx.amount);
    if (existing) {
      existing.amount += amount;
    } else {
      byCategory.set(tx.categoryId, {
        categoryId: tx.categoryId,
        name: tx.categoryName,
        icon: tx.categoryIcon,
        color: tx.categoryColor,
        amount,
      });
    }
  }

  return {
    total,
    categories: Array.from(byCategory.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit),
  };
};

export const groupTransactionsByDay = (
  transactions: Transaction[],
): { title: string; data: Transaction[] }[] => {
  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const label = dayLabel(new Date(tx.createdAt));
    if (!acc[label]) acc[label] = [];
    acc[label].push(tx);
    return acc;
  }, {});
  return Object.entries(grouped).map(([title, data]) => ({ title, data }));
};
