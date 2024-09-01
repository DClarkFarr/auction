export type BidStatus = "active" | "inactive";

export type Bid = {
    id_bid: number;
    id_product: number;
    id_item: number;
    id_user: number;
    amount: number;
    status: BidStatus;
    createdAt: string;
};

export type WithBid<T> = T & { bid: Bid };
