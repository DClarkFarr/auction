import { ProductsGridItem } from "./ProductsSection.type";
import { FullProductItem } from "../../../types/Product";
import ProductCard from "../ProductCard";

const ProductsItem: ProductsGridItem = ({ product }) => {
    /**
     * Do context stuff here as needed / register queryClient hooks, etc
     */

    const onClickBid = (p: FullProductItem) => {
        console.log("clicked bid on", p.product.name);
    };

    return <ProductCard product={product} onClickBid={onClickBid} />;
};

export default ProductsItem;
