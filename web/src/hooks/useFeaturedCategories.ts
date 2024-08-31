import { useQuery } from "@tanstack/react-query";
import SiteService from "../services/SiteService";

export default function useFeaturedCategories() {
    const {
        data: featuredCategories,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: ["featuredCategories"],
        queryFn: () => SiteService.getFeaturedCategories(),
    });

    return {
        featuredCategories: featuredCategories || [],
        isLoading,
        isSuccess,
        error,
    };
}
