import { Link, useNavigate } from "react-router-dom";
import { Category, WithImage } from "../../types/Product";
import { uploadedAsset } from "../../utils/asset";

export default function CategoryCard({
    category,
}: {
    category: WithImage<Category>;
}) {
    const navigate = useNavigate();

    const imgPath = category.image?.path;
    const src = imgPath
        ? uploadedAsset(imgPath)
        : "https://placehold.co/200x120";

    const handleClick = () => {
        navigate(`/categories/${category.slug}`);
    };

    return (
        <div
            className="category group flex flex-col w-full mx-auto rounded overflow-hidden cursor-pointer"
            onClick={handleClick}
        >
            <div className="category__image shrink">
                <img src={src} alt={category.label} className="block w-full" />
            </div>
            <div className="category__footer grow bg-purple-600 transition duration-300 group-hover:bg-purple-800 text-white p-4 flex w-full items-center">
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
            </div>
        </div>
    );
}
