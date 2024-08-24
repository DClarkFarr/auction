import { useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import ChevronLeftIcon from "~icons/ic/baseline-chevron-left";
import useProductQuery from "../../../hooks/admin/useProductQuery";
import { Alert, Spinner } from "flowbite-react";
import UpdateProductForm, {
    UpdateProductFormState,
} from "../../../components/product/UpdateProductForm";
import { Image, ProductDetailItem } from "../../../types/Product";
import ManageDetailItems from "../../../components/product/ManageDetailItems";
import ManageCategory from "../../../components/product/ManageCategory";
import useToastContext from "../../../providers/useToastContext";
import { AxiosError } from "axios";
import ManageTags from "../../../components/product/ManageTags";
import ManageImages from "../../../components/product/ManageImages";

export default function ProductSinglePage() {
    const { toast } = useToastContext();

    const params = useParams();

    const idProduct = useMemo(() => {
        return params.id;
    }, [params.id]);

    const {
        isLoading,
        error,
        product,
        isSuccess,
        update,
        updateDetailitems,
        createProductCategory,
        setProductCategory,
        createProductTag,
        setProductTags,
        appendImages,
    } = useProductQuery(Number(idProduct));

    const onSaveProduct = useCallback(async (data: UpdateProductFormState) => {
        try {
            await update(data);
            toast({
                text: "Product information saved successfully",
                type: "success",
            });
        } catch (err) {
            if (err instanceof AxiosError) {
                toast({
                    text: err.response?.data?.message || err.message,
                    type: "failure",
                });
            } else if (err instanceof Error) {
                toast({
                    text: err.message,
                    type: "failure",
                });
            }
        }
    }, []);

    const onSaveItems = useCallback(async (items: ProductDetailItem[]) => {
        try {
            await updateDetailitems(items);
            toast({
                text: "Product details saved",
                type: "success",
            });
        } catch (err) {
            if (err instanceof AxiosError) {
                toast({
                    text: err.response?.data?.message || err.message,
                    type: "failure",
                });
            } else if (err instanceof Error) {
                toast({
                    text: err.message,
                    type: "failure",
                });
            }
        }
    }, []);

    const onSaveCategory = async (idCategory: number) => {
        try {
            await setProductCategory(product!.id_product, idCategory);
            toast({
                text: "Product category saved successfully",
                type: "success",
            });
        } catch (err) {
            if (err instanceof AxiosError) {
                toast({
                    text: err.response?.data?.message || err.message,
                    type: "failure",
                });
            } else if (err instanceof Error) {
                toast({
                    text: err.message,
                    type: "failure",
                });
            }
        }
    };

    const onSetProductTags = async (idTags: number[]) => {
        try {
            await setProductTags(product!.id_product, idTags);
            toast({
                text: "Product tag saved successfully",
                type: "success",
            });
        } catch (err) {
            if (err instanceof AxiosError) {
                toast({
                    text: err.response?.data?.message || err.message,
                    type: "failure",
                });
            } else if (err instanceof Error) {
                toast({
                    text: err.message,
                    type: "failure",
                });
            }
        }
    };

    const onCreateCategory = useCallback(
        async (categoryLabel: string) => {
            try {
                await createProductCategory(product!.id_product, categoryLabel);
                toast({
                    text: "Category created successfully",
                    type: "success",
                });
            } catch (err) {
                if (err instanceof AxiosError) {
                    toast({
                        text: err.response?.data?.message || err.message,
                        type: "failure",
                    });
                } else if (err instanceof Error) {
                    toast({
                        text: err.message,
                        type: "failure",
                    });
                }
            }
        },
        [product]
    );

    const onAddImages = useCallback((images: Image[]) => {
        appendImages(images);
        toast({
            text: images.length + " Images uploaded successfully",
            type: "success",
        });
    }, []);

    const onCreateTag = useCallback(
        async (tagLabel: string) => {
            try {
                await createProductTag(product!.id_product, tagLabel);
                toast({
                    text: "Tag created successfully",
                    type: "success",
                });
            } catch (err) {
                if (err instanceof AxiosError) {
                    toast({
                        text: err.response?.data?.message || err.message,
                        type: "failure",
                    });
                } else if (err instanceof Error) {
                    toast({
                        text: err.message,
                        type: "failure",
                    });
                }
            }
        },
        [product]
    );

    return (
        <div>
            <div>
                <Link
                    to="/admin/products"
                    className="text-purple-800 hover:underline flex items-center gap-x-1 text-xs"
                >
                    <ChevronLeftIcon />
                    <span>Back</span>
                </Link>
            </div>
            <div>
                <h1 className="text-2xl mb-8">Edit Product</h1>
                {!isSuccess && error && (
                    <Alert color="failure mb-4">{error.message}</Alert>
                )}
                {isLoading && (
                    <div className="p-6">
                        <Spinner size="lg" />
                    </div>
                )}
                {!isLoading && product && (
                    <>
                        <UpdateProductForm
                            product={product}
                            onSubmit={onSaveProduct}
                        />

                        <div className="bg-gray-100 mb-6 p-6">
                            <h2 className="text-xl">Detail Items</h2>
                            <ManageDetailItems
                                onChange={onSaveItems}
                                detailItems={product.detailItems}
                            />
                        </div>

                        <div className="bg-gray-100 mb-6 p-6">
                            <h2 className="text-xl">Categorization</h2>
                            <div className="mb-4">
                                <ManageCategory
                                    category={product.category}
                                    onSelectCategory={onSaveCategory}
                                    onCreateCategory={onCreateCategory}
                                />
                            </div>
                            <ManageTags
                                tags={product.tags}
                                onCreateTag={onCreateTag}
                                onSelectTag={onSetProductTags}
                            />
                        </div>

                        <div className="bg-gray-100 p-6 mb-6">
                            <h2 className="text-xl mb-4">Images</h2>
                            <ManageImages
                                images={product.images}
                                product={product}
                                onAddImages={onAddImages}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
