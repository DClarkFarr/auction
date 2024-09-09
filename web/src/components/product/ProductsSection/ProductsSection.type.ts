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
    isSelected?: boolean;
    onClickBid?: (p: FullProductItem) => void;
    onClickClaim?: (p: FullProductItem) => void;
};
export type ProductsGridItem<P extends ProductsItemProps = ProductsItemProps> =
    (props: P) => React.ReactNode;
