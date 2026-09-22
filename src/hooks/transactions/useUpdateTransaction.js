import { transactionService } from "@/services/transaction.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACCOUNTS_QUERY_KEY } from "../accounts/useGetAccounts";
import { TRANSACTIONS_QUERY_KEY } from "./useGetTransactions";
export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => transactionService.update(id, payload),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
        },
    });
};
