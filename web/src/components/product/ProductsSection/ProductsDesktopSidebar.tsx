import React, { useMemo } from "react";
import { useIsMinBreakpoint } from "../../../hooks/useWindowBreakpoints";
import useCategoriesQuery from "../../../hooks/useCategoriesQuery";

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

export function ProductsSidebarCategories() {
    const { categories } = useCategoriesQuery(true, true);

    const sortedCategories = useMemo(() => {
        if (!categories) {
            return [];
        }
        return categories.sort((a, b) => {
            return b.productCount - a.productCount;
        });
    }, [categories]);

    return (
        <div>
            {sortedCategories.map((c) => {
                return c.label;
            })}
        </div>
    );
}
