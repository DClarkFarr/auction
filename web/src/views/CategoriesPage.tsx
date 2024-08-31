import { Outlet, useParams } from "react-router-dom";

export default function CategoriesPage() {
    const params = useParams();

    const categorySlug = params.categorySlug || "";

    if (categorySlug) {
        return <Outlet />;
    }
    return <div>Categories page</div>;
}
