import { ProductsGridItem } from "./ProductsSection.type";
import { FullProductItem } from "../../../types/Product";
import ProductCard from "../ProductCard";
import React from "react";
import useFavorite from "../../../hooks/useFavorite";
import useStartBid from "../../../hooks/useStartBid";
import useUserBid from "../../../hooks/useUserBid";

const ProductsItem: ProductsGridItem = ({ product }) => {
    /**
     * Do context stuff here as needed / register queryClient hooks, etc
     */

    const { addFavorite, removeFavorite, itemIsFavorite } = useFavorite();

    const { getUserBidStatus, getBid } = useUserBid();

    const showBidModal = useStartBid();

    const toggleFavorite = React.useCallback(
        async (id_item: number) => {
            if (itemIsFavorite(id_item)) {
                await removeFavorite(id_item);
            } else {
                await addFavorite(id_item);
            }
        },
        [itemIsFavorite, addFavorite, removeFavorite]
    );

    const isFavorite = React.useMemo(() => {
        return itemIsFavorite(product.id_item);
    }, [product, itemIsFavorite]);

    const userBid = React.useMemo(() => {
        return getBid(product.id_item);
    }, [product, getBid]);

    const userBidStatus = React.useMemo(() => {
        return getUserBidStatus(product);
    }, [product, getUserBidStatus]);

    const onClickBid = (p: FullProductItem) => {
        showBidModal(p);
    };

    const onClickClaim = () => {
        console.log("TODO: clicked claim");
    };

    return (
        <ProductCard
            product={product}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            onClickBid={onClickBid}
            userBid={userBid}
            userBidStatus={userBidStatus}
            onClickClaim={onClickClaim}
        />
    );
};

export default ProductsItem;
