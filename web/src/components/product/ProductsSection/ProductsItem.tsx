import { ProductsGridItem } from "./ProductsSection.type";
import { FullProductItem } from "../../../types/Product";
import ProductCard from "../ProductCard";
import React from "react";
import useFavorite from "../../../hooks/useFavorite";
import { useGlobalModalContext } from "../../../providers/useGlobalModals";
import useUserStore from "../../../stores/useUserStore";

const ProductsItem: ProductsGridItem = ({ product }) => {
    /**
     * Do context stuff here as needed / register queryClient hooks, etc
     */

    const { addFavorite, removeFavorite, itemIsFavorite } = useFavorite();

    const {
        card: { open: openCardModal },
    } = useGlobalModalContext();

    const { paymentMethod } = useUserStore();

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

    const onClickBid = (p: FullProductItem) => {
        if (paymentMethod) {
            return console.log("show bid modal!!!!");
        }

        openCardModal(() => {
            console.log("saved, now show bid modal!!!");
        });
    };

    return (
        <ProductCard
            product={product}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            onClickBid={onClickBid}
        />
    );
};

export default ProductsItem;
