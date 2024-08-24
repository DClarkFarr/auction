import { useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import ChevronLeftIcon from "~icons/ic/baseline-chevron-left";
import useProductQuery from "../../../hooks/admin/useProductQuery";
import { Alert, Spinner } from "flowbite-react";
import UpdateProductForm, {
    UpdateProductFormState,
} from "../../../components/product/UpdateProductForm";
import { ProductDetailItem } from "../../../types/Product";

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
                    <UpdateProductForm
                        product={product}
                        onSubmit={onSaveProduct}
                        onSaveDetailItems={onSaveItems}
                        onSaveCategory={onSaveCategory}
                        onCreateProductCategory={createProductCategory}
                    />
                )}
            </div>
        </div>
    );
}
