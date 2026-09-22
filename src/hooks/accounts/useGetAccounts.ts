import { accountService } from "@/services/account.service";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";

export const ACCOUNTS_QUERY_KEY = ["accounts"] as const;

export const useGetAccounts = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: accountService.getAll,
    enabled: isAuthenticated,
  });
};
