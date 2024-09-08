import React from "react";
import useUserStore from "../stores/useUserStore";
import { FullProductItem } from "../types/Product";
import { DateTime } from "luxon";

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
    const { bids } = useUserStore();

    const getBid = React.useCallback(
        (id_item: number) => {
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

            const expiresAt = DateTime.fromISO(product.expiresAt);
            const isExpired =
                expiresAt <= DateTime.now() || product.status !== "active";

            if (product.status === "canceled") {
                return BID_STATUS.canceled;
            }

            if (!bid) {
                return null;
            } else if (bid.id_bid === product.bid?.id_bid) {
                if (product.status === "purchased") {
                    return BID_STATUS.purchased;
                }

                if (product.status === "rejected") {
                    return BID_STATUS.rejected;
                }

                if (product.status === "claimed" || isExpired) {
                    return BID_STATUS.won;
                }

                return BID_STATUS.winning;
            } else if (product.bid) {
                if (isExpired) {
                    return BID_STATUS.lost;
                }

                return BID_STATUS.outbid;
            }

            return null;
        },
        [getBid]
    );

    return {
        getBid,
        hasBid,
        getUserBidStatus,
    };
}
