import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Product } from "../../types/Product";
import { useEffect } from "react";
import AdminService from "../../services/AdminService";

export default function useProductsQuery(
    status: Product["status"][],
    page = 1
) {
    const queryClient = useQueryClient();

    const {
        data: pagination,
        isPlaceholderData,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: ["products", status, page],
        queryFn: async () => {
            return AdminService.getProducts({
                status,
                page,
            });
        },
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });

    // Prefetch the next page!
    useEffect(() => {
        if (
            !isPlaceholderData &&
            (pagination?.pages || 0) > (pagination?.page || 0)
        ) {
            queryClient.prefetchQuery({
                queryKey: ["products", status, page + 1],
                queryFn: () =>
                    AdminService.getProducts({ status, page: page + 1 }),
            });
        }
    }, [pagination, isPlaceholderData, page, status, queryClient]);

    return {
        pagination,
        isLoading,
        isSuccess,
        error,
    };
}
