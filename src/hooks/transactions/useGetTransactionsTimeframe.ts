import { transactionService } from "@/services/transaction.service";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { TRANSACTIONS_QUERY_KEY } from "./useGetTransactions";

export const transactionsTimeframeKey = (start: string, end: string) =>
  [...TRANSACTIONS_QUERY_KEY, "timeframe", start, end] as const;

export const useGetTransactionsTimeframe = (start: string, end: string) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: transactionsTimeframeKey(start, end),
    queryFn: () => transactionService.getTimeframe(start, end),
    enabled: isAuthenticated && !!start && !!end,
    staleTime: 60_000,
  });
};
