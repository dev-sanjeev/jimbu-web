import { categoryService } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
export const CATEGORIES_QUERY_KEY = ["categories"];
export const useGetCategories = () => {
    return useQuery({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: categoryService.getAll,
    });
};
