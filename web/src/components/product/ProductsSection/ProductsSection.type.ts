import React from "react";
import { FullProductItem } from "../../../types/Product";

export type ProductsGridProps<I extends ProductsGridItem = ProductsGridItem> = {
    item?: I;
    children?:
        | React.ReactNode
        | ((props: { products: FullProductItem[] }) => React.ReactNode);
};

export type ProductsItemProps = {
    product: FullProductItem;
};
export type ProductsGridItem<P extends ProductsItemProps = ProductsItemProps> =
    (props: P) => React.ReactNode;
