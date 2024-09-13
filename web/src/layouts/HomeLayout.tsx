import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useUserStore, { useWatchUserSession } from "../stores/useUserStore";
import HomeHeader from "./header/HomeHeader";
import HomeFooter from "./footer/HomeFooter";
import LoginFormModal from "../components/modal/LoginFormModal";
import SignupFormModal from "../components/modal/SignupFormModal";
import PaymentMethodModal from "../components/modal/PaymentMethodModal";
import {
    useCardModal,
    useLoginModal,
    useSignupModal,
    useBidModal,
    usePurchaseModal,
} from "../stores/useModalsStore";
import ProductBidModal from "../components/modal/ProductBidModal";
import useSocket from "../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { PaginatedResults } from "../types/Paginate";
import { FullProductItem } from "../types/Product";
import useUserBid from "../hooks/useUserBid";
import useProductsEventsStore from "../stores/useProductsEventStore";
import ClaimPurchaseModal from "../components/modal/ClaimPurchaseModal";
import MiniCartPopover from "../components/checkout/MiniCartPopover";
import { useCartStore } from "../stores/useCartStore";
import { Purchase } from "../types/Purchase";

export default function HomeLayout({
    children,
}: {
    children?: React.ReactNode;
}) {
    useWatchUserSession();

    const {
        user,
        hasLoadedFavorites,
        isLoadingFavorites,
        loadFavorites,
        hasLoadedBids,
        isLoadingBids,
        loadUserBids,
    } = useUserStore();

    const { selectedProducts, showCart, setShowCart } = useCartStore();

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const { getBid } = useUserBid();

    const { addEvent } = useProductsEventsStore();

    const body = React.useMemo(() => {
        return children || <Outlet />;
    }, [children]);

    React.useEffect(() => {
        if (!!user && !hasLoadedFavorites && !isLoadingFavorites) {
            loadFavorites();
        }
    }, [user, hasLoadedFavorites, isLoadingFavorites]);

    React.useEffect(() => {
        if (!!user && !hasLoadedBids && !isLoadingBids) {
            loadUserBids();
        }
    }, [user, hasLoadedBids, isLoadingBids]);

    const handleProductUpdate = React.useRef<
        ((p: FullProductItem) => void) | null
    >(null);

    React.useEffect(() => {
        handleProductUpdate.current = (product: FullProductItem) => {
            const userBid = getBid(product.id_item);

            let hasUpdated = false;

            if (product.bid?.id_user !== user?.id) {
                queryClient.setQueriesData<PaginatedResults<FullProductItem>>(
                    {
                        predicate: ({ queryKey }) =>
                            queryKey.includes("paginatedActiveItems"),
                    },
                    (result) => {
                        if (!result) {
                            return;
                        }

                        const found = result.rows.find(
                            (p) => p.id_item === product.id_item
                        );

                        if (found && !hasUpdated) {
                            if (product.bid?.id_user !== user?.id) {
                                if (
                                    userBid &&
                                    userBid.id_bid === found.bid?.id_bid
                                ) {
                                    addEvent(product.id_item, "outbid");
                                } else {
                                    addEvent(product.id_item, "bid", 2000);
                                }
                                hasUpdated = true;
                            }
                        }

                        return {
                            ...result,
                            rows: result.rows.map((r) =>
                                r.id_item === product.id_item ? product : r
                            ),
                        };
                    }
                );
            }
        };
    }, [getBid]);

    useSocket(handleProductUpdate);

    const { state: loginState } = useLoginModal();
    const { state: signupState } = useSignupModal();
    const { state: cardState } = useCardModal();
    const { state: bidState } = useBidModal();
    const {
        state: purchaseState,
        open: openPurchaseModal,
        close: closePurchaseModal,
    } = usePurchaseModal();

    const onClickCheckout = async () => {
        setShowCart(false);
        openPurchaseModal();
    };

    const onToggleShow = (show: boolean) => {
        setShowCart(show);
    };

    const handleCheckoutSuccess = ({ purchase }: { purchase: Purchase }) => {
        closePurchaseModal();
        navigate(`/account/purchases/${purchase.id_purchase}`);
    };

    return (
        <>
            <div className="layout layout--home">
                <header className="layout__header mb-4 border-b-2 border-gray-300">
                    <HomeHeader />
                </header>
                <main className="layout__main">
                    <MiniCartPopover
                        top={40}
                        right={10}
                        show={showCart}
                        items={selectedProducts}
                        onClickCheckout={onClickCheckout}
                        onClickShow={onToggleShow}
                    />
                    {body}
                </main>
                <footer>
                    <HomeFooter />
                </footer>
            </div>
            <div id="global-modals">
                <LoginFormModal {...loginState} />
                <SignupFormModal {...signupState} />
                <PaymentMethodModal {...cardState} />
                <ProductBidModal {...bidState} />
                <ClaimPurchaseModal
                    items={selectedProducts}
                    onCheckoutSuccess={handleCheckoutSuccess}
                    {...purchaseState}
                />
            </div>
        </>
    );
}
