import { create } from "zustand";
import { FullProductItem } from "../types/Product";

export type ProductBidStore = {
    product: FullProductItem | null;
    bidAmount: number;
    setProduct: (p: FullProductItem | null) => void;
    setBidAmount: (a: number) => void;
};
const useProductBidStore = create<ProductBidStore>((set, get) => {
    const setProduct = (p: FullProductItem | null) => {
        const bidAmount = p
            ? p.bid
                ? p.bid.amount + 1
                : p.product.priceInitial
            : 0;

        set({ product: p, bidAmount });
    };

    const setBidAmount = (a: number) => {
        const p = get().product;
        const minAmount = p
            ? p.bid
                ? p.bid.amount + 1
                : p.product.priceInitial
            : 0;

        set((prev) => ({
            ...prev,
            bidAmount: parseFloat(Math.max(minAmount, a).toFixed(2)),
        }));
    };
    return {
        product: null,
        bidAmount: 0,
        setProduct,
        setBidAmount,
    };
});

export default useProductBidStore;
