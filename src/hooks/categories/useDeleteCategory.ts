import { categoryService } from "@/services/category.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIES_QUERY_KEY } from "./useGetCategories";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: categoryService.remove,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};
