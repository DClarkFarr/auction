import { useParams } from "react-router-dom";

export default function ShopSinglePage() {
    const params = useParams();

    const itemId = params.itemId;

    return <div>Item single page: {itemId}</div>;
}
