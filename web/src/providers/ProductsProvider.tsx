import React, { useCallback, useState } from "react";
import { ProductsContext } from "./useProductsContext";
import usePaginatedActiveItemsQuery from "../hooks/usePaginatedActiveItemsQuery";

export default function ProductsProvider({
    children,
    params: initialParams,
}: React.PropsWithChildren<{ params: Partial<ProductsContext["params"]> }>) {
    const [params, setParamsState] = useState<ProductsContext["params"]>({
        page: 1,
        limit: 20,
        sortBy: null,
        categoryIds: [],
        productIds: [],
        quality: null,
        priceMin: null,
        priceMax: null,
        ...initialParams,
    });

    const { pagination, isLoading, isSuccess, error } =
        usePaginatedActiveItemsQuery(params);

    const setParams: ProductsContext["setParams"] = useCallback((toSet) => {
        setParamsState((prev) => ({ ...prev, ...toSet }));
    }, []);

    const toggleCategory: ProductsContext["toggleCategory"] = useCallback(
        (idCategory) => {
            const index = (params.categoryIds || []).indexOf(idCategory);
            if (index > -1 && params.categoryIds) {
                setParams({
                    categoryIds: params.categoryIds.filter(
                        (c) => c !== idCategory
                    ),
                });
            } else {
                setParams({
                    categoryIds: [...(params.categoryIds || []), idCategory],
                });
            }
        },
        [params, setParams]
    );

    const setPage: ProductsContext["setPage"] = useCallback(
        (pageNum) => {
            setParams({
                page: pageNum,
            });
        },
        [setParams]
    );

    return (
        <ProductsContext.Provider
            value={{
                params,
                pagination,
                isLoading,
                isSuccess,
                error,
                setPage,
                setParams,
                toggleCategory,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
}
