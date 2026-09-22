import { categoryService } from "@/services/category.service";
import { Category, CreateCategoryPayload } from "@/interfaces/Category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIES_QUERY_KEY } from "./useGetCategories";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryPayload>({
    mutationFn: categoryService.create,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};
