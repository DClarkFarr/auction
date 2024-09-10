import React from "react";
import { Outlet } from "react-router-dom";
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
} from "../stores/useModalsStore";
import ProductBidModal from "../components/modal/ProductBidModal";
import useSocket from "../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { PaginatedResults } from "../types/Paginate";
import { FullProductItem } from "../types/Product";

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

    const queryClient = useQueryClient();

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

    useSocket({
        onUpdate(product) {
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

                        console.log("looking at", result.rows);
                        return {
                            ...result,
                            rows: result.rows.map((r) =>
                                r.id_item === product.id_item ? product : r
                            ),
                        };
                    }
                );
            } else {
                console.log("got my own event, so...");
            }
        },
    });

    const { state: loginState } = useLoginModal();
    const { state: signupState } = useSignupModal();
    const { state: cardState } = useCardModal();
    const { state: bidState } = useBidModal();

    return (
        <>
            <div className="layout layout--home">
                <header className="layout__header mb-4 border-b-2 border-gray-300">
                    <HomeHeader />
                </header>
                <main className="layout__main">{body}</main>
                <footer>
                    <HomeFooter />
                </footer>
            </div>
            <div id="global-modals">
                <LoginFormModal {...loginState} />
                <SignupFormModal {...signupState} />
                <PaymentMethodModal {...cardState} />
                <ProductBidModal {...bidState} />
            </div>
        </>
    );
}
