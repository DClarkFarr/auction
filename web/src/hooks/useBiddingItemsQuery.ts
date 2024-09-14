import usePaginatedActiveItemsQuery from "./usePaginatedActiveItemsQuery";
import UserService from "../services/UserService";

export default function useBiddingItemsQuery() {
    const { pagination, isLoading, isSuccess, error } =
        usePaginatedActiveItemsQuery(
            {
                sortBy: null,
                page: 1,
                limit: 100,
                categoryIds: null,
                productIds: null,
                quality: null,
                priceMin: null,
                priceMax: null,
            },
            (params) => {
                return UserService.getUserBidItems({
                    ...params,
                    winning: false,
                    days: 2,
                    status: ["active", "claimed"],
                });
            },
            "cart-store"
        );

    return {
        activeItems: pagination?.rows || [],
        isLoading,
        isSuccess,
        error,
    };
}
