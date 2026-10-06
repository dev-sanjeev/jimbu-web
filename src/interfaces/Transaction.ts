export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface CreateTransactionPayload {
  categoryId: number;
  accountId: number;
  type: TransactionType;
  notes?: string;
  amount: number;
  /** ISO 8601 date string for when the transaction occurred. Optional; backend defaults to now. */
  date?: string;
}

/** Partial update — every field optional. Sent as PATCH /transactions/:id. */
export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  notes: string | null;
  accountId: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  createdAt: string;
}

export interface PaginatedTransactions {
  data: Transaction[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
    count: number;
  };
}

export interface TransactionFilters {
  type?: TransactionType;
  categoryId?: number;
  /** ISO date string (YYYY-MM-DD). */
  startDate?: string;
  /** ISO date string (YYYY-MM-DD). */
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}
