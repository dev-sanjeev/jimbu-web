import apiClient from '@/apiClient';
import type {
  CreateTransactionPayload,
  PaginatedTransactions,
  Transaction,
  TransactionFilters,
  TransactionType,
  UpdateTransactionPayload,
} from '@/interfaces/Transaction';

export const normalizeTransaction = (t: Transaction): Transaction => {
  const raw = t.amount as unknown;
  let amount: number;
  if (typeof raw === 'number') {
    amount = raw;
  } else if (typeof raw === 'string') {
    amount = parseFloat(raw);
  } else {
    amount = NaN;
  }
  return {
    ...t,
    amount,
    type: t.type != null ? (String(t.type).toLowerCase() as TransactionType) : t.type,
  };
};

const normalize = (raw: PaginatedTransactions): PaginatedTransactions => ({
  ...raw,
  data: raw.data.map(normalizeTransaction),
});

export const buildParams = (
  cursor?: string | null,
  filters?: TransactionFilters,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {};
  if (cursor) params.cursor = cursor;
  if (filters?.type) params.type = filters.type;
  if (filters?.categoryId !== undefined) params.categoryId = filters.categoryId;
  if (filters?.startDate) params.startDate = filters.startDate;
  if (filters?.endDate) params.endDate = filters.endDate;
  if (filters?.minAmount !== undefined) params.minAmount = filters.minAmount;
  if (filters?.maxAmount !== undefined) params.maxAmount = filters.maxAmount;
  return params;
};

export const transactionService = {
  create: (payload: CreateTransactionPayload): Promise<void> =>
    apiClient.post('/transactions', payload).then((r) => r.data),

  getMine: (cursor?: string | null, filters?: TransactionFilters): Promise<PaginatedTransactions> =>
    apiClient
      .get('/transactions/my', { params: buildParams(cursor, filters) })
      .then((r) => normalize(r.data)),

  getByAccount: (
    accountId: string,
    cursor?: string | null,
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactions> =>
    apiClient
      .get(`/transactions/account/${accountId}`, { params: buildParams(cursor, filters) })
      .then((r) => normalize(r.data)),

  getTimeframe: (start: string, end: string): Promise<{ data: Transaction[] }> =>
    apiClient
      .get('/transactions/timeframe', { params: { start, end } })
      .then((r) => ({ data: r.data.data.map(normalizeTransaction) })),

  update: (id: number, payload: UpdateTransactionPayload): Promise<void> =>
    apiClient.patch(`/transactions/${id}`, payload).then((r) => r.data),

  remove: (id: number): Promise<void> =>
    apiClient.delete(`/transactions/${id}`).then((r) => r.data),
};
