import React from "react";
import {
    Outlet,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
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
import { useActiveItems, useCartStore } from "../stores/useCartStore";
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

    const activeItems = useActiveItems();

    const { selectedProducts, showCart, setShowCart, setSelectedProducts } =
        useCartStore();

    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useSearchParams();

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

                        if (found) {
                            if (product.bid?.id_user !== user?.id) {
                                if (
                                    userBid &&
                                    userBid.id_bid === found.bid?.id_bid
                                ) {
                                    addEvent(product.id_item, "outbid");
                                } else {
                                    addEvent(product.id_item, "bid", 2000);
                                }
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

    const onClickShow = (clicked: "won" | "winning" | "outbid" | "cart") => {
        const isCheckoutPage = location.pathname.startsWith("/account/bids");
        if (!isCheckoutPage) {
            const view = clicked === "outbid" ? "all" : "winning";
            return navigate(`/account/bids?view=${view}`);
        }

        const currentView = search.get("view");

        if (clicked === "outbid" && currentView !== "all") {
            return setSearch({ view: "all" });
        }
        if (["winning", "won"].includes(clicked) && currentView !== "winning") {
            return setSearch({ view: "winning" });
        }

        if (clicked === "cart") {
            setShowCart(true);
        }
    };

    const handleCheckoutSuccess = ({ purchase }: { purchase: Purchase }) => {
        setSelectedProducts([]);
        closePurchaseModal();
        setShowCart(false);
        navigate(`/account/purchases/${purchase.id_purchase}`);
    };

    const isWinningPage =
        location.pathname.startsWith("/account/bids") &&
        search.get("view") === "winning";
    const isAllPage =
        location.pathname.startsWith("/account/bids") &&
        search.get("view") === "all";

    return (
        <>
            <div className="layout layout--home">
                <header className="layout__header mb-4 border-b-2 border-gray-300">
                    <HomeHeader />
                </header>
                <main className="layout__main">
                    <MiniCartPopover
                        isWinningPage={isWinningPage}
                        isAllPage={isAllPage}
                        numOutbidItems={activeItems.outbidItems.length}
                        numWinningItems={activeItems.winningItems.length}
                        numWonItems={activeItems.wonItems.length}
                        top={10}
                        right={10}
                        items={selectedProducts}
                        show={showCart}
                        onClickCheckout={onClickCheckout}
                        onClickHide={() => setShowCart(false)}
                        onClickShow={onClickShow}
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
