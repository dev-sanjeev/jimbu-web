import { accountService } from "@/services/account.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACCOUNTS_QUERY_KEY } from "./useGetAccounts";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: accountService.remove,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};
