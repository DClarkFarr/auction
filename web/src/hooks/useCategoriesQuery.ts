import { useQuery } from "@tanstack/react-query";
import SiteService from "../services/SiteService";

export default function useCategoriesQuery() {
    const {
        data: categories,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: () => SiteService.getCategories(),
    });

    return {
        categories: categories || [],
        isLoading,
        isSuccess,
        error,
    };
}
