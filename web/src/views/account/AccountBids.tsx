import ProductsSection from "../../components/product/ProductsSection";
import UserService from "../../services/UserService";

export default function AccountBids() {
    return (
        <div className="account-profile">
            <div className="container">
                <h1 className="text-2xl font-bold mb-10">My Bids</h1>

                <ProductsSection
                    method={UserService.getUserBidItems}
                    locationKey="bids"
                >
                    <div className="container">
                        <div className="shop lg:flex gap-x-4">
                            <div className="shop__grid grow">
                                <ProductsSection.Grid />
                                <ProductsSection.EndlessScroller />
                            </div>
                        </div>
                    </div>
                </ProductsSection>
            </div>
        </div>
    );
}
