import { Tabs, TabsRef } from "flowbite-react";
import ProductsSection from "../../components/product/ProductsSection";
import UserService from "../../services/UserService";
import { useSearchParams } from "react-router-dom";
import { PaginatedProductParams } from "../../services/SiteService";
import { FullProductItem } from "../../types/Product";
import { useCartStore } from "../../stores/useCartStore";
import React from "react";

export default function AccountBids() {
    const [search, setSearch] = useSearchParams();

    const tabsRef = React.useRef<TabsRef>(null);

    const view = search.get("view") || "winning";

    const { toggleSelectedProduct, itemIsSelected } = useCartStore();

    const setView = (view: "winning" | "all") => {
        setSearch({ view });
    };

    const options = ["winning", "all"] as const;

    const onClickClaim = (p: FullProductItem) => {
        toggleSelectedProduct(p);
    };

    React.useEffect(() => {
        tabsRef.current?.setActiveTab(view === "winning" ? 0 : 1);
    }, [view]);

    return (
        <div className="account-profile">
            <div className="container">
                <h1 className="text-2xl font-bold mb-10">My Bids</h1>

                <Tabs
                    ref={tabsRef}
                    aria-label="Pills"
                    variant="pills"
                    onActiveTabChange={(index) => setView(options[index])}
                >
                    <Tabs.Item title="Winning Bids" />
                    <Tabs.Item title="All Bids" />
                </Tabs>

                <ProductsSection
                    method={(p: PaginatedProductParams) =>
                        UserService.getUserBidItems({
                            ...p,
                            winning: view === "winning",
                            status:
                                view === "winning"
                                    ? ["active", "claimed"]
                                    : undefined,
                        })
                    }
                    locationKey={`bids-${view}`}
                >
                    <div className="shop lg:flex gap-x-4">
                        <div className="shop__grid grow">
                            <ProductsSection.Grid
                                item={(props) => (
                                    <>
                                        {view === "winning" ? (
                                            <ProductsSection.HistoryItem
                                                {...props}
                                                onClickClaim={onClickClaim}
                                                isSelected={itemIsSelected(
                                                    props.product.id_item
                                                )}
                                            />
                                        ) : (
                                            <ProductsSection.Item
                                                {...props}
                                                onClickClaim={onClickClaim}
                                                isSelected={itemIsSelected(
                                                    props.product.id_item
                                                )}
                                            />
                                        )}
                                    </>
                                )}
                            />
                            <ProductsSection.EndlessScroller />
                        </div>
                    </div>
                </ProductsSection>
            </div>
        </div>
    );
}
