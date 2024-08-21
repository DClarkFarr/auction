import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Product } from "../../types/Product";
import { useEffect } from "react";
import AdminService from "../../services/AdminService";
import { CreateProductFormState } from "../../components/product/CreateProductForm";

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
        retry: false,
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

    const { mutateAsync: handleCreate } = useMutation({
        mutationKey: ["products", status],
        mutationFn: (data: CreateProductFormState) =>
            AdminService.createProduct(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["products", status],
                exact: false,
                refetchType: "all",
            });
        },
    });

    const createProduct = (data: CreateProductFormState) => handleCreate(data);

    return {
        createProduct,
        pagination,
        isLoading,
        isSuccess,
        error,
    };
}
