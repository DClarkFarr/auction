import { Banner, Spinner } from "flowbite-react";
import { useProductsContext } from "../../../providers/useProductsContext";
import { ProductsGridProps } from "./ProductsSection.type";
import EmptyIcon from "~icons/ic/baseline-help";
import ProductsItem from "./ProductsItem";

export default function ProductsGrid({
    item: Item = ProductsItem,
    children,
}: ProductsGridProps) {
    const { products, useEndlessScrolling, isLoading } = useProductsContext();

    const hasChildren = !!children;

    console.log(
        "got",
        !useEndlessScrolling && isLoading,
        "from",
        !useEndlessScrolling,
        isLoading
    );
    if (useEndlessScrolling && isLoading) {
        return (
            <Banner>
                <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                    <div className="mx-auto flex items-center">
                        <p className="flex gap-3 items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                            <Spinner />
                            <span>Loading...</span>
                        </p>
                    </div>
                </div>
            </Banner>
        );
    }

    if (!products.length) {
        return (
            <Banner>
                <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                    <div className="mx-auto flex items-center">
                        <p className="flex gap-3 items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                            <span>
                                <EmptyIcon />
                            </span>
                            <span>No products found. Try another search.</span>
                        </p>
                    </div>
                </div>
            </Banner>
        );
    }

    return (
        <div className="products-grid grid gap-3 w-full">
            {hasChildren &&
                typeof children === "function" &&
                children({ products })}
            {hasChildren && typeof children !== "function" && children}
            {!hasChildren &&
                products.map((product, i) => {
                    return (
                        <Item
                            product={product}
                            key={`${product.id_item}-${i}`}
                        />
                    );
                })}
        </div>
    );
}
