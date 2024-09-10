import React, { ReactNode } from "react";
import {
    Outlet,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import useUserStore, { useWatchUserSession } from "../stores/useUserStore";
import HomeLayout from "./HomeLayout";
import { Spinner } from "flowbite-react";

export default function AccountLayout({ children }: { children?: ReactNode }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const { user } = useUserStore();

    const body = React.useMemo(() => {
        return children || <Outlet />;
    }, [children]);

    useWatchUserSession(async (user) => {
        if (!user) {
            const query = new URLSearchParams(searchParams);
            query.set("redirect", location.pathname + location.search);

            const to = "/login?" + query.toString();

            navigate(to);
        }
    });
    return (
        <HomeLayout>
            {!user ? (
                <div className="p-10">
                    <Spinner />
                </div>
            ) : (
                body
            )}
        </HomeLayout>
    );
}
