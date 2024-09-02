import React from "react";
import { useIsMinBreakpoint } from "../../../hooks/useWindowBreakpoints";
import { useProductsContext } from "../../../providers/useProductsContext";
import ProductsSortBy from "./ProductsSortBy";

function PaginationStatus() {
    const { pagination } = useProductsContext();

    if (!pagination || pagination.page < 1) {
        return null;
    }

    const start = 1;
    const end = Math.min(pagination.limit * pagination.page, pagination.total);
    const total = pagination.total;

    return (
        <div className="text-sm text-gray-500">
            Showing results {start} - {end} of {total}
        </div>
    );
}
export default function ProductsHeading({
    children,
}: {
    children?: React.ReactNode;
}) {
    const isLg = useIsMinBreakpoint("lg");

    return (
        <div className="border-b border-b-gray-300 mb-4">
            <div className="products-heading p-2 bg-gray-200 w-full flex flex-wrap md:flex-nowrap items-center gap-4 justify-end">
                {children}
                {isLg && (
                    <div className="self-end">
                        <PaginationStatus />
                    </div>
                )}
                <div>
                    <ProductsSortBy />
                </div>
            </div>
        </div>
    );
}
