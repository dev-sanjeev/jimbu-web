import { accountService } from "@/services/account.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACCOUNTS_QUERY_KEY } from "./useGetAccounts";
export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: accountService.create,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
        },
    });
};
