import { Tabs } from "flowbite-react";
import { ReactNode, useMemo } from "react";
import SettingsFeaturedProducts from "../../components/settings/FeaturedProducts";
import SettingsFeaturedCategories from "../../components/settings/FeaturedCategories";
import { useSearchParams } from "react-router-dom";

type SettingTabs = "featured-products" | "featured-categories";

export default function SettingsPage() {
    const [search, setSearch] = useSearchParams();

    const activeTab: SettingTabs =
        (search.get("tab") as SettingTabs) || "featured-products";

    const tabs = useMemo<
        {
            title: string;
            key: SettingTabs;
            body: ReactNode;
        }[]
    >(() => {
        return [
            {
                key: "featured-products",
                title: "Featured Products",
                body: <SettingsFeaturedProducts />,
            },
            {
                key: "featured-categories",
                title: "Featured Categories",
                body: <SettingsFeaturedCategories />,
            },
        ];
    }, []);

    return (
        <div>
            <div>
                <h1 className="text-2xl font-semibol mb-8">Site Config</h1>

                <Tabs
                    aria-label="Product Tabs"
                    variant="default"
                    onActiveTabChange={(index) => {
                        setSearch({ tab: tabs[index].key });
                    }}
                >
                    {tabs.map((tab) => {
                        return (
                            <Tabs.Item
                                key={tab.key}
                                active={tab.key === activeTab}
                                title={tab.title}
                            >
                                {tab.body}
                            </Tabs.Item>
                        );
                    })}
                </Tabs>
            </div>
        </div>
    );
}
