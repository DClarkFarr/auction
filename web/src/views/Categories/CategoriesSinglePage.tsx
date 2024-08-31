import { useParams } from "react-router-dom";

export default function CategoriesSinglePage() {
    const params = useParams();

    const categorySlug = params.categorySlug || "unknown";

    return <div>Category slug: {categorySlug}</div>;
}
