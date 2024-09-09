import { Tabs } from "flowbite-react";
import ProductsSection from "../../components/product/ProductsSection";
import UserService from "../../services/UserService";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { PaginatedProductParams } from "../../services/SiteService";
import { FullProductItem } from "../../types/Product";
import MiniCartPopover from "../../components/checkout/MiniCartPopover";
import ClaimPurchaseModal from "../../components/modal/ClaimPurchaseModal";
import { useModal } from "../../hooks/useModal";

export default function AccountBids() {
    const [search, setSearch] = useSearchParams();

    const [selectedProducts, setSelectedProducts] = React.useState<
        FullProductItem[]
    >([]);

    const [showCart, setShowCart] = React.useState(false);

    const view = search.get("view") || "winning";

    const setView = (view: "winning" | "all") => {
        setSearch({ view });
    };

    const purchaseModal = useModal({
        show: false,
        onClose: () => {
            if (selectedProducts.length) {
                setShowCart(true);
            }
        },
    });

    const options = ["winning", "all"] as const;

    const onClickClaim = (p: FullProductItem) => {
        const found =
            selectedProducts.findIndex((pi) => pi.id_item === p.id_item) > -1;

        if (found) {
            setSelectedProducts((prev) =>
                prev.filter((pi) => pi.id_item !== p.id_item)
            );
            if (selectedProducts.length <= 1) {
                setShowCart(false);
            }
        } else {
            setSelectedProducts((prev) => [...prev, p]);
            setShowCart(true);
        }
    };

    const selectedItemIds = React.useMemo(() => {
        return selectedProducts.map((pi) => pi.id_item);
    }, [selectedProducts]);

    const onClickCheckout = async () => {
        setShowCart(false);
        purchaseModal.open();
    };

    const onToggleShow = (show: boolean) => {
        setShowCart(show);
    };

    return (
        <div className="account-profile">
            <MiniCartPopover
                top={40}
                right={10}
                show={showCart}
                items={selectedProducts}
                onClickCheckout={onClickCheckout}
                onClickShow={onToggleShow}
            />

            <div className="container">
                <h1 className="text-2xl font-bold mb-10">My Bids</h1>

                <Tabs
                    aria-label="Pills"
                    variant="pills"
                    onActiveTabChange={(index) => setView(options[index])}
                >
                    <Tabs.Item
                        active={view === "winning"}
                        title="Winning Bids"
                    />
                    <Tabs.Item active={view === "all"} title="All Bids" />
                </Tabs>

                <ProductsSection
                    method={(p: PaginatedProductParams) =>
                        UserService.getUserBidItems({
                            ...p,
                            winning: view === "winning",
                        })
                    }
                    locationKey={`bids-${view}`}
                >
                    <div className="shop lg:flex gap-x-4">
                        <div className="shop__grid grow">
                            <ProductsSection.Grid
                                item={(props) => (
                                    <>
                                        <ProductsSection.Item
                                            {...props}
                                            onClickClaim={onClickClaim}
                                            isSelected={selectedItemIds.includes(
                                                props.product.id_item
                                            )}
                                        />
                                    </>
                                )}
                            />
                            <ProductsSection.EndlessScroller />
                        </div>
                    </div>
                </ProductsSection>
            </div>

            <ClaimPurchaseModal
                items={selectedProducts}
                {...purchaseModal.state}
            />
        </div>
    );
}
