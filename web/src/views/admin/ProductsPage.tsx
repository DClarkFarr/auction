import { Outlet, useParams } from "react-router-dom";
import ManageProducts from "../../components/product/ManageProducts";

export default function ProductsPage() {
    const params = useParams();

    if (params.id) {
        return <Outlet />;
    }

    return <ManageProducts />;
}
