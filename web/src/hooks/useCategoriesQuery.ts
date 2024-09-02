import { useQuery } from "@tanstack/react-query";
import SiteService from "../services/SiteService";

export default function useCategoriesQuery<
    I extends boolean,
    P extends boolean
>(withImage: I, withProductCount: P) {
    const {
        data: categories,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: ["categories", withImage, withProductCount],
        queryFn: () =>
            SiteService.getCategories({ withImage, withProductCount }),
    });

    return {
        categories: categories || [],
        isLoading,
        isSuccess,
        error,
    };
}
