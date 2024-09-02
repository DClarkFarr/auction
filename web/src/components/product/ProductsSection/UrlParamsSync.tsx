import { useSearchParams } from "react-router-dom";
import { useProductsContext } from "../../../providers/useProductsContext";
import React from "react";
import { setProductQueryParams } from "../../../utils/productParams";

export default function UrlParamsSync() {
    const { params } = useProductsContext();
    const [search, setSearch] = useSearchParams();

    React.useEffect(() => {
        const toSet = setProductQueryParams(params, search);

        setSearch(toSet);
    }, [params, search]);

    return <></>;
}
