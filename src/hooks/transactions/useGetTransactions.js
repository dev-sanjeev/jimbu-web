import { transactionService } from "@/services/transaction.service";
import { useAuthStore } from "@/stores/authStore";
import { useInfiniteQuery } from "@tanstack/react-query";
export const TRANSACTIONS_QUERY_KEY = ["transactions"];
export const transactionsKeys = {
    all: TRANSACTIONS_QUERY_KEY,
    my: (filters) => [...TRANSACTIONS_QUERY_KEY, "my", filters ?? {}],
    byAccount: (accountId, filters) => [...TRANSACTIONS_QUERY_KEY, "account", accountId, filters ?? {}],
};
export const useGetTransactions = (accountId, filters) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return useInfiniteQuery({
        queryKey: accountId
            ? transactionsKeys.byAccount(accountId, filters)
            : transactionsKeys.my(filters),
        queryFn: ({ pageParam }) => accountId
            ? transactionService.getByAccount(accountId, pageParam, filters)
            : transactionService.getMine(pageParam, filters),
        initialPageParam: null,
        getNextPageParam: (last) => last.meta.hasNextPage ? last.meta.nextCursor : undefined,
        enabled: isAuthenticated,
    });
};
