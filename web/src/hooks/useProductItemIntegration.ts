import React from "react";
import { FullProductItem } from "../types/Product";
import useFavorite from "./useFavorite";
import useStartBid from "./useStartBid";
import useUserBid from "./useUserBid";

export default function useProductItemIntegration(
    product: FullProductItem,
    {
        onClickBidCustom,
        onClickClaimCustom,
    }: {
        onClickClaimCustom?: (
            p: FullProductItem
        ) => false | void | Promise<false | void>;
        onClickBidCustom?: (
            p: FullProductItem
        ) => false | void | Promise<false | void>;
    } = {}
) {
    const { addFavorite, removeFavorite, itemIsFavorite } = useFavorite();

    const { getUserBidStatus, getBid } = useUserBid();

    const showBidModal = useStartBid(product);

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

    const userBidStatus = React.useMemo(() => {
        return getUserBidStatus(product);
    }, [product, getUserBidStatus]);

    const userBid = React.useMemo(() => {
        return getBid(product.id_item);
    }, [getBid, product.id_item]);

    const onClickBid = async (p: FullProductItem) => {
        if (typeof onClickBidCustom === "function") {
            const abortIfFalse = await onClickBidCustom(p);
            if (abortIfFalse === false) {
                return;
            }
        }
        showBidModal(p);
    };

    const onClickClaim = async (p: FullProductItem) => {
        if (typeof onClickClaimCustom === "function") {
            const abortIfFalse = await onClickClaimCustom(p);
            if (abortIfFalse === false) {
                return;
            }
        }
        console.log("TODO: clicked claim");
    };

    return {
        userBid,
        isFavorite,
        userBidStatus,
        onClickBid,
        onClickClaim,
        toggleFavorite,
    };
}
