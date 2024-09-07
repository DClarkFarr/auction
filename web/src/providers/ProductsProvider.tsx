import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ProductsContext } from "./useProductsContext";
import usePaginatedActiveItemsQuery, {
    PaginatedActiveQueryMethod,
} from "../hooks/usePaginatedActiveItemsQuery";
import { defaultProductParams } from "../utils/productParams";
import { FullProductItem } from "../types/Product";

type ProductsProviderProps = React.PropsWithChildren<{
    params?: Partial<ProductsContext["params"]>;
    method?: PaginatedActiveQueryMethod;
    locationKey: string;
}>;

export default function ProductsProvider({
    children,
    params: initialParams = {},
    method,
    locationKey,
}: ProductsProviderProps) {
    const [params, setParamsState] = useState<ProductsContext["params"]>({
        ...defaultProductParams,
        ...initialParams,
    });

    const {
        pagination: queriedPagination,
        isLoading,
        isSuccess,
        error,
    } = usePaginatedActiveItemsQuery(params, method, locationKey);

    const rows = useMemo(() => {
        return queriedPagination ? queriedPagination.rows : [];
    }, [queriedPagination]);

    const pagination = useMemo(() => {
        return {
            total: queriedPagination?.total || 0,
            limit: queriedPagination?.limit || 0,
            page: queriedPagination?.page || 0,
            pages: queriedPagination?.pages || 0,
        };
    }, [queriedPagination]);

    const [products, setProducts] = useState<FullProductItem[]>([]);

    const setParams: ProductsContext["setParams"] = useCallback((toSet) => {
        setParamsState((prev) => ({ ...prev, ...toSet }));
    }, []);

    const toggleCategory: ProductsContext["toggleCategory"] = useCallback(
        (idCategory) => {
            const index = (params.categoryIds || []).indexOf(idCategory);
            if (index > -1 && params.categoryIds) {
                setParams({
                    page: 1,
                    categoryIds: params.categoryIds.filter(
                        (c) => c !== idCategory
                    ),
                });
            } else {
                setParams({
                    page: 1,
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

    useEffect(() => {
        const { page, limit } = pagination;
        const offset = page * limit - limit;

        if (page === 1) {
            setProducts(rows);
            return;
        }
        setProducts((prevProducts) => {
            const ps = [...prevProducts];
            ps.splice(offset, limit, ...rows);

            return ps;
        });
    }, [rows, pagination]);

    const value = useMemo(() => {
        return {
            params,
            products,
            pagination,
            isLoading,
            isSuccess,
            error,
            setPage,
            setParams,
            toggleCategory,
        };
    }, [params, pagination, products, isLoading, isSuccess, error]);

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
}
