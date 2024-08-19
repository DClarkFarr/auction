import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    Outlet,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useWatchUserSession } from "../stores/useUserStore";
import AdminSidebar from "./sidebar/AdminSidebar";
import { useIsMinBreakpoint } from "../hooks/useWindowBreakpoints";

export type AdminLayoutContext = {
    menuOpen: boolean;
    toggleMenuOpen: (open: boolean) => void;
};
const AdminLayoutContext = createContext<AdminLayoutContext>({
    menuOpen: false,
    toggleMenuOpen: () => {},
});

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenuOpen = useCallback((open: boolean) => {
        setMenuOpen(open);
    }, []);

    return (
        <AdminLayoutContext.Provider value={{ menuOpen, toggleMenuOpen }}>
            {children}
        </AdminLayoutContext.Provider>
    );
}

export function useAdminLayout() {
    const context = useContext(AdminLayoutContext);

    return context;
}

export default function AdminLayout({ children }: { children?: ReactNode }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const { menuOpen, toggleMenuOpen } = useAdminLayout();

    const isMd = useIsMinBreakpoint("md");

    useEffect(() => {
        if (!menuOpen && isMd) {
            toggleMenuOpen(true);
        } else if (menuOpen && !isMd) {
            toggleMenuOpen(false);
        }
    }, [isMd]);

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
            <main className="layout__main lg:flex">
                {menuOpen && (
                    <div className="layout__sidebar">
                        <AdminSidebar />
                    </div>
                )}
                <div className="layout__content p-6">
                    {children && children}
                    {!children && <Outlet />}
                </div>
            </main>
            <footer className="layout__footer">some footer?</footer>
        </div>
    );
}
