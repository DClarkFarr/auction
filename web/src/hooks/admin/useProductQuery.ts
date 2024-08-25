import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/AdminService";
import { UpdateProductFormState } from "../../components/product/UpdateProductForm";
import {
    Category,
    FullProduct,
    Image,
    ProductDetailItem,
    Tag,
} from "../../types/Product";

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

    const { mutateAsync: mutateCreateTag } = useMutation({
        mutationFn: ({
            idProduct,
            label,
        }: {
            idProduct: number;
            label: string;
        }) => {
            return AdminService.createProductTag(idProduct, label);
        },
        onSuccess: (tag) => {
            queryClient.invalidateQueries({
                queryKey: ["product", idProduct],
            });

            const tags = queryClient.getQueryData<Tag[]>(["tags"]) || [];

            queryClient.setQueryData(
                ["tags"],
                [...tags, tag].sort((a, b) => a.label.localeCompare(b.label))
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

    const { mutateAsync: mutateSetTags } = useMutation({
        mutationFn: ({
            idProduct,
            idTags,
        }: {
            idProduct: number;
            idTags: number[];
        }) => {
            return AdminService.setProductTags(idProduct, idTags);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["product", idProduct],
            });
        },
    });

    const { mutateAsync: mutateDeleteImage } = useMutation({
        mutationFn: ({ idImage }: { idImage: number }) =>
            AdminService.deleteProductImage(idProduct, idImage),
        onSuccess: (_v, { idImage }) => {
            queryClient.setQueryData(
                ["product", idProduct],
                (prev: FullProduct) => {
                    const toSet = { ...prev } as FullProduct;

                    return {
                        ...toSet,
                        images: toSet.images.filter(
                            (i) => i.id_image !== idImage
                        ),
                    };
                }
            );
        },
    });

    const deleteProductImage = async (idImage: number) => {
        await mutateDeleteImage({ idImage });
    };

    const appendImages = (images: Image[]) => {
        const p =
            ((queryClient.getQueryData(["product", idProduct]) ||
                null) as FullProduct) || null;
        if (p?.images) {
            queryClient.setQueryData(["product", idProduct], {
                ...p,
                images: [...p.images, ...images],
            });
        }
    };

    const update = (data: UpdateProductFormState) => mutateUpdate(data);

    const updateDetailitems = (data: ProductDetailItem[]) => mutateItems(data);

    const createProductCategory = (idProduct: number, categoryLabel: string) =>
        mutateCreateCategory({ idProduct, label: categoryLabel }).then(
            () => {}
        );

    const setProductCategory = (idProduct: number, idCategory: number) =>
        mutateSetCategory({ idProduct, idCategory }).then(() => {});

    const setProductTags = async (idProduct: number, idTags: number[]) => {
        await mutateSetTags({ idProduct, idTags });
    };

    const createProductTag = async (idProduct: number, tagLabel: string) => {
        await mutateCreateTag({ idProduct, label: tagLabel });
    };

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
        appendImages,
        updateDetailitems,
        deleteProductImage,
        createProductCategory,
        setProductCategory,
        setProductTags,
        createProductTag,
    };
}
