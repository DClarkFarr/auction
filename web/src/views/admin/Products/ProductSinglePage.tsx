import { useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import ChevronLeftIcon from "~icons/ic/baseline-chevron-left";
import useProductQuery from "../../../hooks/admin/useProductQuery";
import { Alert, Spinner } from "flowbite-react";
import UpdateProductForm, {
    UpdateProductFormState,
} from "../../../components/product/UpdateProductForm";
import { ProductDetailItem } from "../../../types/Product";
import ManageDetailItems from "../../../components/product/ManageDetailItems";
import ManageCategory from "../../../components/product/ManageCategory";

export default function ProductSinglePage() {
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
    } = useProductQuery(Number(idProduct));

    const onSaveProduct = useCallback(async (data: UpdateProductFormState) => {
        await update(data);
    }, []);

    const onSaveItems = useCallback(async (items: ProductDetailItem[]) => {
        await updateDetailitems(items);
    }, []);

    const onSaveCategory = useCallback(
        async (idCategory: number) => {
            await setProductCategory(product!.id_product, idCategory);
        },
        [product]
    );

    const onCreateCategory = useCallback(
        (categoryLabel: string) => {
            return createProductCategory(product!.id_product, categoryLabel);
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
                            <h2 className="text-xl">Category</h2>
                            <ManageCategory
                                category={product.category}
                                onSelectCategory={onSaveCategory}
                                onCreateCategory={onCreateCategory}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
