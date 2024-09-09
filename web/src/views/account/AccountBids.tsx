import { Tabs } from "flowbite-react";
import ProductsSection from "../../components/product/ProductsSection";
import UserService from "../../services/UserService";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { PaginatedProductParams } from "../../services/SiteService";

export default function AccountBids() {
    const [search, setSearch] = useSearchParams();

    const view = search.get("view") || "winning";

    const setView = (view: "winning" | "all") => {
        setSearch({ view });
    };

    const options = ["winning", "all"] as const;

    return (
        <div className="account-profile">
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
                            <ProductsSection.Grid />
                            <ProductsSection.EndlessScroller />
                        </div>
                    </div>
                </ProductsSection>
            </div>
        </div>
    );
}
