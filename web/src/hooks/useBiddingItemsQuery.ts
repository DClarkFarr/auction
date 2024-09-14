import usePaginatedActiveItemsQuery from "./usePaginatedActiveItemsQuery";
import UserService from "../services/UserService";
import { useQueryClient } from "@tanstack/react-query";
import { PaginatedResults } from "../types/Paginate";
import { FullProductItem } from "../types/Product";

export default function useBiddingItemsQuery() {
    const queryClient = useQueryClient();

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

    const refresh = () => {
        queryClient.setQueriesData<PaginatedResults<FullProductItem>>(
            {
                predicate: ({ queryKey }) => {
                    return queryKey?.includes("cart-store");
                },
            },
            (data) => {
                if (!data) {
                    return;
                }

                return {
                    ...data,
                    rows: [],
                };
            }
        );
        queryClient.invalidateQueries({
            predicate: ({ queryKey }) => {
                return queryKey?.includes("cart-store");
            },
        });
    };

    return {
        activeItems: pagination?.rows || [],
        refresh,
        isLoading,
        isSuccess,
        error,
    };
}
