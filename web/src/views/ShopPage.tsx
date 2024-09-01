import { useEffect } from "react";
// import PaymentMethodWizard from "../components/stripe/PaymentMethodWizard";
import SiteService from "../services/SiteService";
import ProductsSection from "../components/product/ProductsSection";

export default function ShopPage() {
    useEffect(() => {
        SiteService.getPaginatedActiveItems();
    }, []);
    return (
        <ProductsSection>
            <div className="container">get ready to show products here</div>
        </ProductsSection>
    );
}
