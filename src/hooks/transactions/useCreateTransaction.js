import { transactionService } from "@/services/transaction.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TRANSACTIONS_QUERY_KEY } from "./useGetTransactions";
export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: transactionService.create,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
        },
    });
};
