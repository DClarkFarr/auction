// import PaymentMethodWizard from "../components/stripe/PaymentMethodWizard";
import ProductsSection from "../components/product/ProductsSection";

export default function ShopPage() {
    return (
        <ProductsSection>
            <div className="container">
                <div className="shop lg:flex gap-x-4">
                    <ProductsSection.DesktopSidebar>
                        <ProductsSection.SidebarCategories multiple />
                        <ProductsSection.SidebarQualities />
                        <ProductsSection.SidebarPrices />
                    </ProductsSection.DesktopSidebar>
                    <div className="shop__grid grow">
                        <ProductsSection.Grid />
                        <ProductsSection.EndlessScroller />
                    </div>
                </div>
            </div>
        </ProductsSection>
    );
}
