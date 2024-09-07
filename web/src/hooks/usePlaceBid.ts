import {
    useBidModal,
    useCardModal,
    useLoginModal,
} from "../stores/useModalsStore";
import useProductBidStore from "../stores/useProductBidStore";
import useUserStore from "../stores/useUserStore";
import { FullProductItem } from "../types/Product";

export default function usePlaceBid() {
    const { user, paymentMethod } = useUserStore();
    const { setProduct } = useProductBidStore();

    const bidModal = useBidModal();
    const cardModal = useCardModal();
    const loginModal = useLoginModal();

    const showPlaceBidModal = (p: FullProductItem) => {
        console.log(
            "showPlaceBidModal",
            "user",
            user,
            "payment method",
            paymentMethod,
            "product",
            p
        );
        if (!user) {
            loginModal.open(
                {},
                {
                    scope: "login",
                    callback: () => {
                        console.log(
                            "login !user callback calling",
                            "showPlaceBidModal",
                            "user",
                            user,
                            "payment method",
                            paymentMethod,
                            "product",
                            p
                        );
                        showPlaceBidModal(p);
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
                    callback: () => {
                        console.log(
                            "card !paymentMethod callback calling",
                            "showPlaceBidModal",
                            "user",
                            user,
                            "payment method",
                            paymentMethod,
                            "product",
                            p
                        );
                        showPlaceBidModal(p);
                    },
                }
            );
            return;
        }
        console.log("setting and showing");
        setProduct(p);
        bidModal.open();
    };

    return showPlaceBidModal;
}
