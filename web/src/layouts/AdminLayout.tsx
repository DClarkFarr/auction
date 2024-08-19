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
import AdminHeader from "./header/AdminHeader";
import { AdminFooter } from "./footer/AdminFooter";

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
        <div className="layout layout--admin flex flex-col min-h-screen">
            <header className="layout__header sticky top-0">
                <AdminHeader />
            </header>
            <main className="layout__main w-full flex h-full grow">
                {menuOpen && (
                    <div className="layout__sidebar shrink">
                        <AdminSidebar fullWidth={!isMd} />
                    </div>
                )}
                <div className="layout__content grow p-6">
                    {children && children}
                    {!children && <Outlet />}
                </div>
            </main>
            <footer className="layout__footer">
                <AdminFooter />
            </footer>
        </div>
    );
}
