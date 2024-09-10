import { DateTime } from "luxon";
import { BID_STATUS, UserBidStatus } from "../hooks/useUserBid";
import { Bid } from "../types/Bid";
import { FullProductItem } from "../types/Product";
import { User } from "../types/User";

export const calculateBidStatus = (
    user: User | null,
    product: FullProductItem,
    userBid?: Bid
): UserBidStatus | null => {
    const bid =
        userBid ||
        (user && product.bid?.id_user === user.id ? product.bid : null);

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
};
