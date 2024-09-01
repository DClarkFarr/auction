import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import SiteService, { PaginatedProductParams } from "../services/SiteService";
import { useEffect } from "react";
import {
    filterDefaultProductParams,
    makePaginatedActiveItemsKey,
} from "../utils/productParams";

export default function usePaginatedActiveItemsQuery(
    params: PaginatedProductParams
) {
    const queryClient = useQueryClient();

    const {
        data: pagination,
        isPlaceholderData,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: makePaginatedActiveItemsKey(params),
        queryFn: () => {
            const data = filterDefaultProductParams(params);
            return SiteService.getPaginatedActiveItems(data);
        },
        placeholderData: keepPreviousData,
        staleTime: 5000,
        retry: false,
    });

    useEffect(() => {
        if (
            !isPlaceholderData &&
            (pagination?.pages || 0) > (pagination?.page || 1)
        ) {
            const nextPageParams = { ...params, page: (params.page || 1) + 1 };
            queryClient.prefetchQuery({
                queryKey: makePaginatedActiveItemsKey(nextPageParams),
                queryFn: () =>
                    SiteService.getPaginatedActiveItems(nextPageParams),
            });
        }
    }, [pagination, isPlaceholderData, params, queryClient]);

    return {
        isSuccess,
        isLoading,
        pagination,
        error,
    };
}
