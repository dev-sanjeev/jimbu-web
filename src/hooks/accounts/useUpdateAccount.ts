import { accountService } from "@/services/account.service";
import { Account, CreateAccountPayload } from "@/interfaces/Account";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACCOUNTS_QUERY_KEY } from "./useGetAccounts";

interface UpdateAccountVars {
  id: string;
  payload: Partial<CreateAccountPayload>;
}

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<Account, Error, UpdateAccountVars>({
    mutationFn: ({ id, payload }) => accountService.update(id, payload),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};
