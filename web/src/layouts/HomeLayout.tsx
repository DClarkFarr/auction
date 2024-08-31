import { ReactNode, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useWatchUserSession } from "../stores/useUserStore";
import HomeHeader from "./header/HomeHeader";
import HomeFooter from "./footer/HomeFooter";
import StripeProvider from "../providers/StripeProvider";

export default function HomeLayout({ children }: { children?: ReactNode }) {
    useWatchUserSession();

    const body = useMemo(() => {
        return children || <Outlet />;
    }, [children]);
    return (
        <StripeProvider>
            <div className="layout layout--home">
                <header className="layout__header">
                    <HomeHeader />
                </header>
                <main className="layout__main">{body}</main>
                <footer className="layout__footer py-5">
                    <HomeFooter />
                </footer>
            </div>
        </StripeProvider>
    );
}
