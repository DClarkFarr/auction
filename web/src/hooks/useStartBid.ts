import React from "react";
import {
    useBidModal,
    useCardModal,
    useLoginModal,
} from "../stores/useModalsStore";
import useProductBidStore from "../stores/useProductBidStore";
import useUserStore from "../stores/useUserStore";
import { FullProductItem } from "../types/Product";
import ModalEmitter from "./useModalEvents";

export default function useStartBid(product: FullProductItem) {
    const { user, paymentMethod, loadUserBids } = useUserStore();
    const { setProduct } = useProductBidStore();

    const bidModal = useBidModal();
    const cardModal = useCardModal();
    const loginModal = useLoginModal();

    const showPlaceBidModal = (p: FullProductItem) => {
        if (!user) {
            loginModal.open(
                {},
                {
                    scope: "login",
                    callback: async () => {
                        await loadUserBids();
                        ModalEmitter.emit("show:bid", p);
                    },
                }
            );
            return;
        }

        if (!paymentMethod) {
            cardModal.open(
                {},
                {
                    scope: "card",
                    callback: async () => {
                        await loadUserBids();
                        ModalEmitter.emit("show:bid", p);
                    },
                }
            );
            return;
        }

        setProduct(p);
        bidModal.open();
    };

    React.useEffect(() => {
        const cb = (p: FullProductItem) => {
            if (p.id_item === product.id_item) {
                showPlaceBidModal(p);
            }
        };
        ModalEmitter.on("show:bid", cb);

        return () => {
            ModalEmitter.off("show:bid", cb);
        };
    }, [user, paymentMethod, product]);

    return showPlaceBidModal;
}
