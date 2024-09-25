import { Link, useNavigate } from "react-router-dom";
import { Category, WithImage, WithProductCount } from "../../types/Product";
import { uploadedAsset } from "../../utils/asset";

function hasProductCount(
    c: Category | WithProductCount<Category>
): c is WithProductCount<Category> {
    return typeof (c as WithProductCount<Category>).productCount === "number";
}
export default function CategoryCard<
    C extends Category | WithProductCount<Category>
>({ category }: { category: WithImage<C> }) {
    const navigate = useNavigate();

    const imgPath = category.image?.path;
    const src = imgPath
        ? uploadedAsset(imgPath)
        : "https://placehold.co/200x120";

    const handleClick = () => {
        navigate(`/categories/${category.slug}`);
    };

    const hasCount = hasProductCount(category);

    const productCount = hasCount ? category.productCount : 0;

    return (
        <div
            className="category group flex flex-col w-full mx-auto rounded overflow-hidden cursor-pointer"
            onClick={handleClick}
        >
            <div className="category__image relative">
                <img
                    src={src}
                    alt={category.label}
                    className="relative block aspect-[2] object-fit object-center object-cover w-full"
                />
                {hasCount && !productCount && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-600/25 flex justify-center items-center">
                        <div className="text-xl text-white">
                            No active products
                        </div>
                    </div>
                )}
            </div>
            <div
                className={`category__footer transition duration-300 text-white p-4 flex w-full items-center ${
                    !hasCount || productCount > 0
                        ? `bg-cyan-600 group-hover:bg-cyan-800`
                        : `bg-gray-600 group-hover:bg-gray-800`
                }`}
            >
                <div>
                    <h3 className="text-xl font-semibold">
                        <Link
                            to={`/categories/${category.slug}`}
                            onClick={(e) => e.preventDefault()}
                        >
                            {category.label}
                        </Link>
                    </h3>
                </div>
                {hasCount && (
                    <>
                        <div className="ml-auto text-sm flex items-center gap-x-2">
                            <div>Active Items</div>
                            <div className="rounded-full bg-white leadning-none py-1 px-2 text-gray-800 flex-inline items-center justify-center">
                                {productCount}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
