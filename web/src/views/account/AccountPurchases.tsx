import { Outlet, useParams } from "react-router-dom";
import PurchaseList from "../../components/purchase/PurchaseList";

export default function AccountPurchases() {
    const params = useParams();

    const purchaseId = params.id;

    return purchaseId ? <Outlet /> : <PurchaseList />;
}
