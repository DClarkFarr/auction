import React from "react";
import { useProductsContext } from "../../../providers/useProductsContext";
import Pagination from "../../controls/Pagination";

export default function ProductsPagination() {
    const { pagination, setPage, setProducts, queriedPagination } =
        useProductsContext();

    const onChangePage = (selected: number) => {
        setPage(selected);
    };

    React.useEffect(() => {
        setProducts(queriedPagination?.rows || []);
    }, [queriedPagination, setProducts]);

    return (
        <div className="py-4">
            <Pagination {...pagination} onClick={onChangePage} />
        </div>
    );
}
