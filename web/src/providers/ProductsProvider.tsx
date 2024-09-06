import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ProductsContext } from "./useProductsContext";
import usePaginatedActiveItemsQuery from "../hooks/usePaginatedActiveItemsQuery";
import { defaultProductParams } from "../utils/productParams";
import { FullProductItem } from "../types/Product";

export default function ProductsProvider({
    children,
    params: initialParams = {},
}: React.PropsWithChildren<{ params?: Partial<ProductsContext["params"]> }>) {
    const [params, setParamsState] = useState<ProductsContext["params"]>({
        ...defaultProductParams,
        ...initialParams,
    });

    const {
        pagination: queriedPagination,
        isLoading,
        isSuccess,
        error,
    } = usePaginatedActiveItemsQuery(params);

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
            console.log("page was 1, do reset");
            setProducts(rows);
            return;
        }
        setProducts((prevProducts) => {
            const ps = [...prevProducts];
            ps.splice(offset, limit, ...rows);
            console.log(
                "splicing page",
                page,
                "offset",
                offset,
                "for limit",
                limit,
                "rows.length",
                rows.length
            );
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
