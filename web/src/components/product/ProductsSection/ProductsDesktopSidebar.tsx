import React from "react";
import { useIsMinBreakpoint } from "../../../hooks/useWindowBreakpoints";

export default function ProductsDesktopSidebar({
    children,
}: {
    children: React.ReactNode;
}) {
    const isDesktop = useIsMinBreakpoint("lg");

    if (!isDesktop) {
        return null;
    }

    return <div className="products-sidebar w-[300px] shrink">{children}</div>;
}
