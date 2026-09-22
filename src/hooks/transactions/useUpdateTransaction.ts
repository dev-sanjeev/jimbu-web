import { UpdateTransactionPayload } from "@/interfaces/Transaction";
import { transactionService } from "@/services/transaction.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACCOUNTS_QUERY_KEY } from "../accounts/useGetAccounts";
import { TRANSACTIONS_QUERY_KEY } from "./useGetTransactions";

interface Vars {
  id: number;
  payload: UpdateTransactionPayload;
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Vars>({
    mutationFn: ({ id, payload }) => transactionService.update(id, payload),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};
