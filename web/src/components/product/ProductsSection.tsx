import React from "react";
import ProductsProvider from "../../providers/ProductsProvider";
import { useSearchParams } from "react-router-dom";
import { getProductQueryParams } from "../../utils/productParams";

import { PaginatedProductParams } from "../../services/SiteService";

import ProductsEndlessScroller from "./ProductsSection/ProductsEndlessScroller";
import ProductsDesktopSidebar, {
    ProductSidebarPrices,
    ProductsSidebarCategories,
    ProductsSidebarQualities,
} from "./ProductsSection/ProductsDesktopSidebar";
import UrlParamsSync from "./ProductsSection/UrlParamsSync";
import ProductsGrid from "./ProductsSection/ProductsGrid";
import ProductsItem from "./ProductsSection/ProductsItem";
import ProductsHeading from "./ProductsSection/ProductsHeading";
import ProductsSortBy from "./ProductsSection/ProductsSortBy";
import ProductsToggleMobileFilters from "./ProductsSection/ProductsToggleMobileFilters";

function ProductsSectionWrapper({
    children,
    params: overrideParams,
}: React.PropsWithChildren<{ params?: Partial<PaginatedProductParams> }>) {
    const [search] = useSearchParams();

    const params = React.useMemo(() => {
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

const ProductsSection = Object.assign(ProductsSectionWrapper, {
    UrlParamsSync,
    Item: ProductsItem,
    Grid: ProductsGrid,
    DesktopSidebar: ProductsDesktopSidebar,
    EndlessScroller: ProductsEndlessScroller,
    SidebarCategories: ProductsSidebarCategories,
    SidebarQualities: ProductsSidebarQualities,
    SidebarPrices: ProductSidebarPrices,
    Heading: ProductsHeading,
    SortBy: ProductsSortBy,
    ToggleMobileFilters: ProductsToggleMobileFilters,
});

export default ProductsSection;
