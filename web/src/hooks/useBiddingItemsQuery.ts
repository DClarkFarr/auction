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
            (params) =>
                UserService.getUserBidItems({
                    ...params,
                    winning: false,
                }),
            "cart-store"
        );

    return {
        activeItems: pagination?.rows || [],
        isLoading,
        isSuccess,
        error,
    };
}
