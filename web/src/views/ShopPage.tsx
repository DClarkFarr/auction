// import PaymentMethodWizard from "../components/stripe/PaymentMethodWizard";
import React from "react";
import ProductsSection from "../components/product/ProductsSection";
import { useIsMaxBreakpoint } from "../hooks/useWindowBreakpoints";
import { Breadcrumb } from "flowbite-react";
import HomeIcon from "~icons/ic/baseline-house";
import { Link } from "react-router-dom";

export default function ShopPage() {
    const isMobile = useIsMaxBreakpoint("md");

    const drawerRef = React.useRef<HTMLDivElement>(null);

    return (
        <ProductsSection>
            <div className="container">
                <div className="shop lg:flex gap-x-4">
                    <ProductsSection.DesktopSidebar teleportMobile={drawerRef}>
                        <ProductsSection.SidebarCategories multiple />
                        <ProductsSection.SidebarQualities />
                        <ProductsSection.SidebarPrices />
                    </ProductsSection.DesktopSidebar>
                    <div className="shop__grid grow">
                        <Breadcrumb
                            aria-label="Category single page defaults"
                            className="mb-2"
                        >
                            <Breadcrumb.Item icon={HomeIcon}>
                                <Link
                                    className="text-purple-900 hover:underline"
                                    to="/"
                                >
                                    Home
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Shop</Breadcrumb.Item>
                        </Breadcrumb>
                        <ProductsSection.Heading>
                            <div className={`mr-auto ${!isMobile && "hidden"}`}>
                                <ProductsSection.ToggleMobileFilters
                                    visible={isMobile}
                                    ref={drawerRef}
                                />
                            </div>
                        </ProductsSection.Heading>
                        <ProductsSection.Grid />
                        <ProductsSection.EndlessScroller />
                    </div>
                </div>
            </div>
        </ProductsSection>
    );
}
