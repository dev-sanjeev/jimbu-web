import { accountService } from "@/services/account.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACCOUNTS_QUERY_KEY } from "./useGetAccounts";
export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => accountService.update(id, payload),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
        },
    });
};
