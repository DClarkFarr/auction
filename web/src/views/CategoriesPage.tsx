import { Outlet, useParams } from "react-router-dom";
import useCategoriesQuery from "../hooks/useCategoriesQuery";
import CategoryCard from "../components/category/CategoryCard";
import { useMemo } from "react";

export default function CategoriesPage() {
    const params = useParams();

    const categorySlug = params.categorySlug || "";

    const { categories } = useCategoriesQuery(true, true);

    const sortedCategories = useMemo(() => {
        return categories.sort((a, b) => {
            if (a.productCount !== b.productCount) {
                return b.productCount - a.productCount;
            }

            return a.label.localeCompare(b.label);
        });
    }, [categories]);

    if (categorySlug) {
        return <Outlet />;
    }

    return (
        <section className="section">
            <div className="container">
                <div className="categories-grid grid gap-4">
                    {sortedCategories.map((c) => {
                        return (
                            <CategoryCard category={c} key={c.id_category} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
