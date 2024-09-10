import { useParams } from "react-router-dom";
import PurchaseDetails from "../../../components/purchase/PurchaseDetails";
import usePurchaseQuery from "../../../hooks/usePurchaseQuery";

export default function AccountPurchaseDetails() {
    const params = useParams();

    const purchaseId = Number(params.id!);

    const { purchase, isLoading, error } = usePurchaseQuery(purchaseId);

    return (
        <PurchaseDetails
            purchase={purchase}
            isLoading={isLoading}
            error={error}
        />
    );
}
