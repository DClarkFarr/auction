import { ReactNode } from "react";
import {
    Outlet,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useWatchUserSession } from "../stores/useUserStore";

export default function AdminLayout({ children }: { children?: ReactNode }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useWatchUserSession(async (user) => {
        if (!user || user.role !== "admin") {
            const query = new URLSearchParams(searchParams);
            query.set("redirect", location.pathname + location.search);

            const to = "/login?" + query.toString();

            navigate(to);
        }
    });
    return (
        <div className="layout layout--home">
            <header className="layout__header">A header here</header>
            <main className="layout__main">
                {children && children}
                {!children && <Outlet />}
            </main>
            <footer className="layout__footer">some footer?</footer>
        </div>
    );
}
