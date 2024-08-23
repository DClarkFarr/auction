import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/AdminService";
import { UpdateProductFormState } from "../../components/product/UpdateProductForm";
import { ProductDetailItem } from "../../types/Product";

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

    const { mutateAsync: mutateUpdate } = useMutation({
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

    const { mutateAsync: mutateItems } = useMutation({
        mutationKey: ["product", idProduct],
        mutationFn: (items: ProductDetailItem[]) =>
            AdminService.updateProductDetailItems(idProduct, items),
        onSuccess: (product) => {
            queryClient.setQueryData(["product", idProduct], product);
            queryClient.invalidateQueries({
                queryKey: ["products"],
                exact: false,
            });
        },
    });

    const update = (data: UpdateProductFormState) => mutateUpdate(data);

    const updateDetailitems = (data: ProductDetailItem[]) => mutateItems(data);

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
        updateDetailitems,
    };
}
