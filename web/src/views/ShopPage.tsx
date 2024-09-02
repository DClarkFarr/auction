// import PaymentMethodWizard from "../components/stripe/PaymentMethodWizard";
import React from "react";
import ProductsSection from "../components/product/ProductsSection";
import { useIsMaxBreakpoint } from "../hooks/useWindowBreakpoints";

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
