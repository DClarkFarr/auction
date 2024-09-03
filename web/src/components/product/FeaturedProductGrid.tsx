import React from "react";
import useFeaturedProducts from "../../hooks/useFeaturedProducts";
import { FullProductItem } from "../../types/Product";
import ProductCard from "./ProductCard";

export type FeaturedProductsGridProps = {
    maxCols?: number;
};
export default function FeaturedProductGrid({
    maxCols = 3,
}: FeaturedProductsGridProps) {
    const { featuredProducts } = useFeaturedProducts();

    const items: FullProductItem[] = React.useMemo(() => {
        return featuredProducts
            .slice(0, maxCols)
            .map(({ item, name, description, image: imagePath }) => {
                item.product.name = name;
                item.product.description = description;

                const imageIndex = item.product.images.findIndex(
                    (i) => i.path === imagePath
                );
                if (imageIndex > -1 && imageIndex !== 0) {
                    const img = item.product.images[imageIndex];
                    item.product.images.splice(imageIndex, 0);
                    item.product.images = [img, ...item.product.images];
                }

                return item;
            });
    }, [featuredProducts]);

    if (!featuredProducts) {
        return null;
    }

    const onClickBid = (p: FullProductItem) => {
        console.log("fp clicked", p.product.name);
    };

    return (
        <div className="featured-products-grid grid gap-4 justify-center">
            {items.map((item, i) => {
                return (
                    <ProductCard
                        key={item.id_item + "-" + i}
                        product={item}
                        onClickBid={onClickBid}
                    />
                );
            })}
        </div>
    );
}
