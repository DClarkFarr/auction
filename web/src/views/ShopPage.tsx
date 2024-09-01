import { useEffect } from "react";
import PaymentMethodWizard from "../components/stripe/PaymentMethodWizard";
import SiteService from "../services/SiteService";

export default function ShopPage() {
    useEffect(() => {
        SiteService.getPaginatedActiveItems();
    }, []);
    return <div className="container"></div>;
}
