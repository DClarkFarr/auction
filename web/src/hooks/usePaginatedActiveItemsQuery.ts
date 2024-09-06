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
import { PaginatedResults } from "../types/Paginate";
import { FullProductItem } from "../types/Product";

export type PaginatedActiveQueryMethod = (
    params: PaginatedProductParams
) => Promise<PaginatedResults<FullProductItem>>;

export default function usePaginatedActiveItemsQuery(
    params: PaginatedProductParams,
    method: PaginatedActiveQueryMethod = SiteService.getPaginatedActiveItems,
    locationKey: string
) {
    const queryClient = useQueryClient();

    const {
        data: pagination,
        isPlaceholderData,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: makePaginatedActiveItemsKey(locationKey, params),
        queryFn: () => {
            const data = filterDefaultProductParams(params);
            return method(data);
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
                queryKey: makePaginatedActiveItemsKey(
                    locationKey,
                    nextPageParams
                ),
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
