import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import AdminService from "../../services/AdminService";

export default function usePaginatedCategoriesQuery(page: number) {
    const queryClient = useQueryClient();

    const {
        data: pagination,
        isLoading,
        isSuccess,
        isPlaceholderData,
        error,
    } = useQuery({
        queryKey: ["paginatedCategories", page],
        queryFn: () => AdminService.getPaginatedCategories({ page }),
        placeholderData: keepPreviousData,
        staleTime: 5000,
        retry: false,
    });

    useEffect(() => {
        if (
            !isPlaceholderData &&
            (pagination?.pages || 0) > (pagination?.page || 0)
        ) {
            queryClient.prefetchQuery({
                queryKey: ["paginatedCategories", page + 1],
                queryFn: () =>
                    AdminService.getPaginatedCategories({
                        page: page + 1,
                    }),
            });
        }
    }, [pagination, isPlaceholderData, page, queryClient]);

    return {
        pagination,
        isLoading,
        isSuccess,
        error,
    };
}
