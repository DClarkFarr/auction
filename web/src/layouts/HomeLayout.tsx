import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { useWatchUserSession } from "../stores/useUserStore";
import HomeHeader from "./header/HomeHeader";
import HomeFooter from "./footer/HomeFooter";

export default function HomeLayout({ children }: { children?: ReactNode }) {
    useWatchUserSession();
    return (
        <div className="layout layout--home">
            <header className="layout__header">
                <HomeHeader />
            </header>
            <main className="layout__main">
                {children && children}
                {!children && <Outlet />}
            </main>
            <footer className="layout__footer py-5">
                <HomeFooter />
            </footer>
        </div>
    );
}
