import {
    keepPreviousData,
    useMutation,
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
import UserService from "../services/UserService";

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
                queryFn: () => method(nextPageParams),
            });
        }
    }, [
        pagination,
        isPlaceholderData,
        params,
        queryClient,
        locationKey,
        method,
    ]);

    return {
        isSuccess,
        isLoading,
        pagination,
        error,
    };
}

export const usePlaceBidMutation = () => {
    const queryClient = useQueryClient();
    const { mutateAsync: placeBid } = useMutation({
        mutationFn: ({
            id_item,
            amount,
        }: {
            id_item: number;
            amount: number;
        }) => {
            return SiteService.placeBid(id_item, amount);
        },
        onSuccess: (product) => {
            queryClient.setQueriesData<PaginatedResults<FullProductItem>>(
                {
                    predicate: ({ queryKey }) =>
                        queryKey.includes("paginatedActiveItems"),
                },
                (result) => {
                    if (!result) {
                        return;
                    }
                    return {
                        ...result,
                        rows: result.rows.map((r) =>
                            r.id_item === product.id_item ? product : r
                        ),
                    };
                }
            );
        },
    });

    return placeBid;
};

export const useCheckoutMutation = () => {
    const queryClient = useQueryClient();

    const { mutateAsync: mutateCheckout } = useMutation({
        mutationFn: (params: { itemIds: number[] }) =>
            UserService.checkoutItems(params),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: ({ queryKey }) =>
                    queryKey.includes("paginatedActiveItems"),
            });
        },
    });

    return mutateCheckout;
};
