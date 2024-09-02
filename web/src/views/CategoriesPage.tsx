import { Outlet, useParams } from "react-router-dom";
import useCategoriesQuery from "../hooks/useCategoriesQuery";
import CategoryCard from "../components/category/CategoryCard";

export default function CategoriesPage() {
    const params = useParams();

    const categorySlug = params.categorySlug || "";

    const { categories } = useCategoriesQuery(true, true);

    if (categorySlug) {
        return <Outlet />;
    }

    return (
        <section className="section">
            <div className="container">
                <div className="categories-grid grid gap-4">
                    {categories.map((c) => {
                        return (
                            <CategoryCard category={c} key={c.id_category} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
