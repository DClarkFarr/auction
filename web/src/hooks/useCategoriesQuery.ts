import { useQuery } from "@tanstack/react-query";
import SiteService from "../services/SiteService";

export default function useCategoriesQuery<I extends boolean>(withImage: I) {
    const {
        data: categories,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: () => SiteService.getCategories({ withImage }),
    });

    return {
        categories: categories || [],
        isLoading,
        isSuccess,
        error,
    };
}
