import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/AdminService";
import { UpdateProductFormState } from "../../components/product/UpdateProductForm";

export default function useProductQuery(idProduct: number) {
    const queryClient = useQueryClient();

    const {
        data: product,
        isLoading,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ["product", idProduct],
        queryFn: () => AdminService.getProduct(idProduct),
    });

    const { mutateAsync } = useMutation({
        mutationKey: ["product", idProduct],
        mutationFn: (data: UpdateProductFormState) => {
            return AdminService.updateProduct(idProduct, data);
        },
        onSuccess: (product) => {
            queryClient.setQueryData(["product", idProduct], product);
            queryClient.invalidateQueries({
                queryKey: ["products"],
                exact: false,
            });
        },
    });

    const update = (data: UpdateProductFormState) => mutateAsync(data);

    const refresh = () => {
        queryClient.refetchQueries({
            queryKey: ["product", idProduct],
        });
    };

    return {
        product,
        isLoading,
        error,
        isSuccess,
        refresh,
        update,
    };
}
