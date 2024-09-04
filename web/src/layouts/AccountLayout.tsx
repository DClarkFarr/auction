import React, { ReactNode } from "react";
import {
    Outlet,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useWatchUserSession } from "../stores/useUserStore";
import HomeLayout from "./HomeLayout";

export default function AccountLayout({ children }: { children?: ReactNode }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

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
    return <HomeLayout>{body}</HomeLayout>;
}
