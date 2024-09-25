import { Sidebar } from "flowbite-react";

import PieChart from "~icons/ic/baseline-pie-chart";
import UsersIcon from "~icons/ic/outline-supervisor-account";
import ProductsIcon from "~icons/ic/outline-shopping-basket";
import CategoriesIcon from "~icons/ic/baseline-category";
import SettingsIcon from "~icons/ic/baseline-settings";

import { useLocation } from "react-router-dom";
import { ComponentProps, FC, ReactNode } from "react";

function SidebarItem({
    currentPath,
    href,
    children,
    icon,
    exact = false,
}: {
    exact?: boolean;
    currentPath: string;
    href: string;
    children: ReactNode;
    icon: FC<ComponentProps<"svg">>;
}) {
    const active =
        (exact && currentPath === href) ||
        (!exact && currentPath.startsWith(href));

    return (
        <Sidebar.Item active={active} href={href} icon={icon}>
            {children}
        </Sidebar.Item>
    );
}
export default function AdminSidebar({ fullWidth }: { fullWidth: boolean }) {
    const location = useLocation();

    return (
        <Sidebar
            className={fullWidth ? "w-full" : ""}
            aria-label="Sidebar with logo branding example"
            theme={{
                item: {
                    active: "bg-cyan-200 hover:bg-cyan-300",
                },
            }}
        >
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <SidebarItem
                        exact
                        currentPath={location.pathname}
                        href="/admin"
                        icon={PieChart}
                    >
                        Dashboard
                    </SidebarItem>

                    <SidebarItem
                        currentPath={location.pathname}
                        href="/admin/users"
                        icon={UsersIcon}
                    >
                        Users
                    </SidebarItem>
                    <SidebarItem
                        currentPath={location.pathname}
                        href="/admin/products"
                        icon={ProductsIcon}
                    >
                        Products
                    </SidebarItem>
                    <SidebarItem
                        currentPath={location.pathname}
                        href="/admin/categories"
                        icon={CategoriesIcon}
                    >
                        Categories
                    </SidebarItem>
                    <SidebarItem
                        currentPath={location.pathname}
                        href="/admin/settings"
                        icon={SettingsIcon}
                    >
                        Site Config
                    </SidebarItem>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
