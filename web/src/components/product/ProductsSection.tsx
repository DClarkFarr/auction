import React, { useEffect, useMemo } from "react";
import ProductsProvider from "../../providers/ProductsProvider";
import { useSearchParams } from "react-router-dom";
import { useProductsContext } from "../../providers/useProductsContext";
import {
    getProductQueryParams,
    setProductQueryParams,
} from "../../utils/productParams";
import { PaginatedProductParams } from "../../services/SiteService";

function ProductsSectionWrapper({
    children,
    params: overrideParams,
}: React.PropsWithChildren<{ params?: Partial<PaginatedProductParams> }>) {
    const [search] = useSearchParams();

    const params = useMemo(() => {
        return { ...getProductQueryParams(search), ...overrideParams };
    }, [search, overrideParams]);

    return (
        <div className="products-section">
            <ProductsProvider params={params}>
                <UrlParamsSync />
                {children}
            </ProductsProvider>
        </div>
    );
}

function UrlParamsSync() {
    const { params } = useProductsContext();
    const [search, setSearch] = useSearchParams();

    useEffect(() => {
        const toSet = setProductQueryParams(params, search);

        setSearch(toSet);
    }, [params, search]);

    return <></>;
}

const ProductsSection = Object.assign(ProductsSectionWrapper, {
    UrlParamsSync,
});

export default ProductsSection;
