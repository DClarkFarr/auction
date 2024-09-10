import React from "react";
import useUserStore from "../stores/useUserStore";
import { FullProductItem } from "../types/Product";
import { calculateBidStatus } from "../utils/product";

export const BID_STATUS = {
    canceled: "canceled", // was cancelled regardless of betting
    purchased: "purchased", // nothing more to do
    rejected: "rejected", // user chose not to buy
    won: "won", // product expired w/ user's highest bid
    winning: "winning", // user has highest bid for now
    lost: "lost", // user bid but product expired with higher bid
    outbid: "outbid", // user's bid was beat, but there's still time
} as const;

export type UserBidStatus = keyof typeof BID_STATUS;

export default function useUserBid() {
    const { bids, user } = useUserStore();

    const getBid = React.useCallback(
        (id_item: number) => {
            // TODO
            return;
            return bids.find((b) => b.id_item === id_item);
        },
        [bids, bids.length]
    );

    const hasBid = React.useCallback(
        (id_item: number) => {
            return !!getBid(id_item);
        },
        [getBid]
    );

    const getUserBidStatus = React.useCallback(
        (product: FullProductItem): UserBidStatus | null => {
            const bid = getBid(product.id_item);

            return calculateBidStatus(user, product, bid);
        },
        [getBid]
    );

    return {
        getBid,
        hasBid,
        getUserBidStatus,
    };
}
