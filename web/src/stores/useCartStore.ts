import { create } from "zustand";
import { FullProductItem } from "../types/Product";
import { usePurchaseModal } from "./useModalsStore";
import React from "react";
import useWinningItemsQuery from "../hooks/useWinningItemsQuery";

export type CartStateStore = {
    showCart: boolean;
    selectedProducts: FullProductItem[];
    setSelectedProducts(selectedProducts: FullProductItem[]): void;
    toggleSelectedProduct(product: FullProductItem): void;
    setShowCart(showCart: boolean): void;
};

const useCartStateStore = create<CartStateStore>((set, get) => {
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
    const { selectedProducts, setShowCart, ...rest } = useCartStateStore();

    const { winningItems } = useWinningItemsQuery();

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
        winningItems,
        ...rest,
    };
}
