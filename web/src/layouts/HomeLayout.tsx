import { ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useUserStore from "../stores/useUserStore";

export default function HomeLayout({ children }: { children?: ReactNode }) {
    const [hasRefreshed, setHasRefreshed] = useState(false);

    const { refresh, isLoading } = useUserStore();

    useEffect(() => {
        if (!hasRefreshed && !isLoading) {
            setHasRefreshed(true);
            refresh();
        }
    }, [hasRefreshed]);
    return (
        <div className="layout layout--home">
            <header className="layout__header">
                <h1 className="text-gray-500">Header menu</h1>
            </header>
            <main className="layout__main">
                {children && children}
                {!children && <Outlet />}
            </main>
            <footer className="layout__footer">dis da footer</footer>
        </div>
    );
}
