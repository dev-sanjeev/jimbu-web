import { categoryService } from "@/services/category.service";
import { Category } from "@/interfaces/Category";
import { useQuery } from "@tanstack/react-query";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export const useGetCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoryService.getAll,
  });
};
