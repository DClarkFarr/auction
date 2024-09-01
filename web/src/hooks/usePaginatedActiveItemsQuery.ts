import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import SiteService, { PaginatedProductParams } from "../services/SiteService";
import { useEffect } from "react";

function makePaginatedActiveItemsKey({
    page,
    ...params
}: PaginatedProductParams) {
    const arr = ["paginatedActiveItems"];

    const joinValues = (
        key: string,
        value: string | null | number | number[]
    ) => {
        let str = key + ":";
        if (Array.isArray(value)) {
            str += value.join("|");
        } else if (value) {
            str += String(value);
        } else {
            str += "default";
        }

        return str;
    };

    Object.entries(params).forEach(([key, value]) => {
        arr.push(joinValues(key, value));
    });

    arr.push(`page:${page}`);

    return arr;
}
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
        queryFn: () => SiteService.getPaginatedActiveItems(params),
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
