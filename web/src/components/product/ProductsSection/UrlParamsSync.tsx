import { useSearchParams } from "react-router-dom";
import { useProductsContext } from "../../../providers/useProductsContext";
import React from "react";
import { setProductQueryParams } from "../../../utils/productParams";

export default function UrlParamsSync() {
    const { params, useEndlessScrolling } = useProductsContext();
    const [search, setSearch] = useSearchParams();

    React.useEffect(() => {
        const toSet = setProductQueryParams(
            params,
            search,
            useEndlessScrolling
        );

        setSearch(toSet);
    }, [params, search, useEndlessScrolling]);

    return <></>;
}
