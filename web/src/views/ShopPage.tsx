// import PaymentMethodWizard from "../components/stripe/PaymentMethodWizard";
import ProductsSection from "../components/product/ProductsSection";

export default function ShopPage() {
    return (
        <ProductsSection>
            <div className="container">
                <div className="shop lg:flex">
                    <ProductsSection.DesktopSidebar>
                        sidebar here
                    </ProductsSection.DesktopSidebar>
                    <div className="shop__grid grow">
                        <ProductsSection.Grid />
                    </div>
                </div>
            </div>
        </ProductsSection>
    );
}
