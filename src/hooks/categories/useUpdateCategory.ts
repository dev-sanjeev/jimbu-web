import { categoryService } from "@/services/category.service";
import { Category, UpdateCategoryPayload } from "@/interfaces/Category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIES_QUERY_KEY } from "./useGetCategories";

interface UpdateCategoryVars {
  id: number;
  payload: UpdateCategoryPayload;
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, UpdateCategoryVars>({
    mutationFn: ({ id, payload }) => categoryService.update(id, payload),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};
