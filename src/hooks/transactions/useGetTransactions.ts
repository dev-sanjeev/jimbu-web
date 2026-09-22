import { TransactionFilters } from "@/interfaces/Transaction";
import { transactionService } from "@/services/transaction.service";
import { useAuthStore } from "@/stores/authStore";
import { useInfiniteQuery } from "@tanstack/react-query";

export const TRANSACTIONS_QUERY_KEY = ["transactions"] as const;

export const transactionsKeys = {
  all: TRANSACTIONS_QUERY_KEY,
  my: (filters?: TransactionFilters) =>
    [...TRANSACTIONS_QUERY_KEY, "my", filters ?? {}] as const,
  byAccount: (accountId: string, filters?: TransactionFilters) =>
    [...TRANSACTIONS_QUERY_KEY, "account", accountId, filters ?? {}] as const,
};

export const useGetTransactions = (
  accountId?: string,
  filters?: TransactionFilters,
) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useInfiniteQuery({
    queryKey: accountId
      ? transactionsKeys.byAccount(accountId, filters)
      : transactionsKeys.my(filters),
    queryFn: ({ pageParam }) =>
      accountId
        ? transactionService.getByAccount(accountId, pageParam, filters)
        : transactionService.getMine(pageParam, filters),
    initialPageParam: null as string | null,
    getNextPageParam: (last) =>
      last.meta.hasNextPage ? last.meta.nextCursor : undefined,
    enabled: isAuthenticated,
  });
};
