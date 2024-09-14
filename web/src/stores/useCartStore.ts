import { create } from "zustand";
import { FullProductItem } from "../types/Product";
import { usePurchaseModal } from "./useModalsStore";
import React from "react";
import useBiddingItemsQuery from "../hooks/useBiddingItemsQuery";
import { DateTime } from "luxon";
import useUserStore from "./useUserStore";
import { isEqual } from "lodash-es";

export type CartStateStore = {
    showCart: boolean;
    selectedProducts: FullProductItem[];
    setSelectedProducts(selectedProducts: FullProductItem[]): void;
    toggleSelectedProduct(product: FullProductItem): void;
    setShowCart(showCart: boolean): void;
};

export const useCartStoreState = create<CartStateStore>((set, get) => {
    const setShowCart = (showCart: boolean) => {
        set({ showCart });
    };

    const setSelectedProducts = (selectedProducts: FullProductItem[]) => {
        set({ selectedProducts });
    };

    const toggleSelectedProduct = (p: FullProductItem) => {
        const selectedProducts = get().selectedProducts;
        const found =
            selectedProducts.findIndex((pi) => pi.id_item === p.id_item) > -1;

        if (found) {
            const toSet = selectedProducts.filter(
                (pi) => pi.id_item !== p.id_item
            );

            set({ selectedProducts: toSet });

            if (toSet.length <= 1) {
                set({ showCart: false });
            }
        } else {
            set({ selectedProducts: [...selectedProducts, p], showCart: true });
        }
    };

    return {
        selectedProducts: [],
        showCart: false,
        setShowCart,
        setSelectedProducts,
        toggleSelectedProduct,
    };
});

export function useCartStore() {
    const purchaseModal = usePurchaseModal();
    const { selectedProducts, setShowCart, ...rest } = useCartStoreState();

    const onPurchaseModalRef = React.useRef(() => {
        purchaseModal.close();
        if (selectedProducts.length) {
            setShowCart(true);
        }
    });

    const selectedItemIds = React.useMemo(() => {
        return selectedProducts.map((pi) => pi.id_item);
    }, [selectedProducts]);

    const itemIsSelected = (id_item: number) => {
        return selectedItemIds.includes(id_item);
    };

    React.useEffect(() => {
        purchaseModal.update({
            onClose: () => {
                onPurchaseModalRef.current();
            },
        });
    }, []);

    return {
        selectedItemIds,
        selectedProducts,
        setShowCart,
        itemIsSelected,
        ...rest,
    };
}

export function useActiveItems() {
    const { user } = useUserStore();
    const { activeItems } = useBiddingItemsQuery();

    const [itemsByType, setItemsByType] = React.useState<{
        winningItems: FullProductItem[];
        wonItems: FullProductItem[];
        outbidItems: FullProductItem[];
    }>({
        winningItems: [],
        wonItems: [],
        outbidItems: [],
    });

    const calculateItemStatus = React.useCallback(() => {
        const now = DateTime.now();
        const toReturn: Record<
            "winningItems" | "wonItems" | "outbidItems",
            FullProductItem[]
        > = {
            winningItems: [],
            wonItems: [],
            outbidItems: [],
        };

        activeItems.forEach((item) => {
            const expiresAt = DateTime.fromISO(item.expiresAt);

            if (now > expiresAt) {
                if (item.bid?.id_user === user?.id) {
                    toReturn.wonItems.push(item);
                } else {
                    // lost, nothing
                }
            } else {
                if (item.bid?.id_user === user?.id) {
                    toReturn.winningItems.push(item);
                } else {
                    toReturn.outbidItems.push(item);
                }
            }
        });

        const getTotals = (obj: Record<string, FullProductItem[]>) => {
            return Object.keys(obj).reduce((acc, key) => {
                return { ...acc, [key]: obj[key].length };
            }, {});
        };

        setItemsByType((prev) => {
            if (!isEqual(getTotals(toReturn), getTotals(prev))) {
                return toReturn;
            }

            return prev;
        });
    }, [activeItems, user]);

    React.useEffect(() => {
        const id = setInterval(() => {
            calculateItemStatus();
        }, 1000);

        return () => {
            clearInterval(id);
        };
    }, [calculateItemStatus]);

    return { ...itemsByType };
}
