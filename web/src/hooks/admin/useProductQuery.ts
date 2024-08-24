import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/AdminService";
import { UpdateProductFormState } from "../../components/product/UpdateProductForm";
import { Category, ProductDetailItem } from "../../types/Product";

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

    const { mutateAsync: mutateCreateCategory } = useMutation({
        mutationFn: ({
            idProduct,
            label,
        }: {
            idProduct: number;
            label: string;
        }) => {
            return AdminService.createProductCategory(idProduct, label);
        },
        onSuccess: (category) => {
            queryClient.invalidateQueries({
                queryKey: ["product", idProduct],
            });

            const categories =
                queryClient.getQueryData<Category[]>(["categories"]) || [];

            queryClient.setQueryData(
                ["categories"],
                [...categories, category].sort((a, b) =>
                    a.label.localeCompare(b.label)
                )
            );
        },
    });

    const { mutateAsync: mutateSetCategory } = useMutation({
        mutationFn: ({
            idProduct,
            idCategory,
        }: {
            idProduct: number;
            idCategory: number;
        }) => {
            return AdminService.setProductCategory(idProduct, idCategory);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["product", idProduct],
            });
        },
    });

    const update = (data: UpdateProductFormState) => mutateUpdate(data);

    const updateDetailitems = (data: ProductDetailItem[]) => mutateItems(data);

    const createProductCategory = (idProduct: number, categoryLabel: string) =>
        mutateCreateCategory({ idProduct, label: categoryLabel }).then(
            () => {}
        );

    const setProductCategory = (idProduct: number, idCategory: number) =>
        mutateSetCategory({ idProduct, idCategory }).then(() => {});

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
        createProductCategory,
        setProductCategory,
    };
}
