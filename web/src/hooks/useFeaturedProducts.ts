import { useQuery } from "@tanstack/react-query";
import SiteService from "../services/SiteService";

export default function useFeaturedProducts() {
    const {
        data: featuredProducts,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: ["featuredProducts"],
        queryFn: () => SiteService.getFeaturedProducts(),
    });

    return {
        featuredProducts: featuredProducts || [],
        isLoading,
        isSuccess,
        error,
    };
}
