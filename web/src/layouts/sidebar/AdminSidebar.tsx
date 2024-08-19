import { Sidebar } from "flowbite-react";

import PieChart from "~icons/ic/baseline-pie-chart";
import UsersIcon from "~icons/ic/outline-supervisor-account";
import ProductsIcon from "~icons/ic/outline-shopping-basket";

export default function AdminSidebar({ fullWidth }: { fullWidth: boolean }) {
    return (
        <Sidebar
            className={fullWidth ? "w-full" : ""}
            aria-label="Sidebar with logo branding example"
        >
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="#" icon={PieChart}>
                        Dashboard
                    </Sidebar.Item>

                    <Sidebar.Item href="#" icon={UsersIcon}>
                        Users
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={ProductsIcon}>
                        Products
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
