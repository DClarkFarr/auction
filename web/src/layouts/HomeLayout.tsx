import React from "react";
import { Outlet } from "react-router-dom";
import useUserStore, { useWatchUserSession } from "../stores/useUserStore";
import HomeHeader from "./header/HomeHeader";
import HomeFooter from "./footer/HomeFooter";
import StripeProvider from "../providers/StripeProvider";

export default function HomeLayout({
    children,
}: {
    children?: React.ReactNode;
}) {
    useWatchUserSession();

    const { user, hasLoadedFavorites, isLoadingFavorites, loadFavorites } =
        useUserStore();

    const body = React.useMemo(() => {
        return children || <Outlet />;
    }, [children]);

    React.useEffect(() => {
        if (!!user && !hasLoadedFavorites && !isLoadingFavorites) {
            loadFavorites();
        }
    }, [user, hasLoadedFavorites, isLoadingFavorites]);

    return (
        <StripeProvider>
            <div className="layout layout--home">
                <header className="layout__header mb-4 border-b-2 border-gray-300">
                    <HomeHeader />
                </header>
                <main className="layout__main">{body}</main>
                <footer>
                    <HomeFooter />
                </footer>
            </div>
        </StripeProvider>
    );
}
