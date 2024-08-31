import { useMemo } from "react";
import useFeaturedCategories from "../../hooks/useFeaturedCategories";
import { uploadedAsset } from "../../utils/asset";
import { Link, useNavigate } from "react-router-dom";

export default function FeaturedCategoryGrid({
    maxCount = 4,
}: {
    maxCount?: number;
}) {
    const { featuredCategories } = useFeaturedCategories();

    const navigate = useNavigate();

    const cols = Math.min(4, maxCount);

    const categories = useMemo(() => {
        return featuredCategories.slice(0, cols);
    }, [cols, featuredCategories]);

    const handleClick = (fc: (typeof featuredCategories)[0]) => {
        navigate(`/categories/${fc.category.slug}`);
    };

    if (!categories.length) {
        return null;
    }
    return (
        <>
            <div
                className={`grid featured-category-grid lg:grid-cols-${cols} gap-[1px]`}
            >
                {categories.map((fc) => {
                    const imgPath = fc.image || fc.category?.image?.path;
                    const src = imgPath
                        ? uploadedAsset(imgPath)
                        : "https://placehold.co/200x120";

                    return (
                        <div
                            onClick={() => handleClick(fc)}
                            className="category h-[200px] cursor-pointer overflow-hidden relative min-h-full w-full h-full flex flex-col mx-auto justify-center items-center max-w-[350px] lg:max-w-full"
                        >
                            <div className="category__background absolute">
                                <img
                                    src={src}
                                    alt={fc.name}
                                    className="block h-full w-full object-fit object-center object-cover"
                                />
                                <div className="category__background-filter absolute top-0 left-0 right-0 bottom-0"></div>
                            </div>
                            <div className="category__content relative text-white text-center p-6">
                                <h3 className="text-xl mb-2">
                                    <Link
                                        to={`/categories/${fc.category.slug}`}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {fc.name}
                                    </Link>
                                </h3>
                                <p>{fc.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="hidden">
                <div className="lg:grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4"></div>
            </div>
        </>
    );
}
