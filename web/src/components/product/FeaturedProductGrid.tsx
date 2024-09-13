import React from "react";
import useFeaturedProducts from "../../hooks/useFeaturedProducts";
import { FullProductItem } from "../../types/Product";
import ProductCard from "./ProductCard";
import useProductItemIntegration from "../../hooks/useProductItemIntegration";
import useUserBid from "../../hooks/useUserBid";
import useUserStore from "../../stores/useUserStore";
import useSocket from "../../hooks/useSocket";
import useProductsEventsStore from "../../stores/useProductsEventStore";

export type FeaturedProductsGridProps = {
    maxCols?: number;
};
export default function FeaturedProductGrid({
    maxCols = 3,
}: FeaturedProductsGridProps) {
    const { featuredProducts, updateFeaturedProduct } = useFeaturedProducts();

    const { user } = useUserStore();

    const handleProductUpdate = React.useRef<
        ((p: FullProductItem) => void) | null
    >(null);

    const { getBid } = useUserBid();

    const { addEvent } = useProductsEventsStore();

    React.useEffect(() => {
        handleProductUpdate.current = (product: FullProductItem) => {
            if (product.bid?.id_user !== user?.id) {
                const userBid = getBid(product.id_item);

                updateFeaturedProduct(product, (oldProduct) => {
                    if (product.bid?.id_user !== user?.id) {
                        if (
                            userBid &&
                            userBid.id_bid === oldProduct.bid?.id_bid
                        ) {
                            addEvent(product.id_item, "outbid");
                        } else {
                            addEvent(product.id_item, "bid", 2000);
                        }
                    }

                    return product;
                });
            }
        };
    }, [getBid]);

    useSocket(handleProductUpdate);

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
    }, [featuredProducts, maxCols]);

    if (!featuredProducts) {
        return null;
    }

    return (
        <div className="featured-products-grid grid gap-4 justify-center">
            {items.map((item, i) => {
                return <FeaturedProductWrapper key={i} product={item} />;
            })}
        </div>
    );
}

function FeaturedProductWrapper({ product }: { product: FullProductItem }) {
    const {
        userBid,
        isFavorite,
        userBidStatus,
        onClickBid,
        onClickClaim,
        toggleFavorite,
    } = useProductItemIntegration(product);

    return (
        <ProductCard
            product={product}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            onClickBid={onClickBid}
            onClickClaim={onClickClaim}
            userBid={userBid}
            userBidStatus={userBidStatus}
        />
    );
}
