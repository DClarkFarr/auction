import { Tabs } from "flowbite-react";
import { ReactNode, useMemo, useState } from "react";
import SettingsFeaturedProducts from "../../components/settings/FeaturedProducts";
import SettingsFeaturedCategories from "../../components/settings/FeaturedCategories";

type SettingTabs = "featured-products" | "featured-categories";

export default function SettingsPage() {
    const [activeTab, setActiveTab] =
        useState<SettingTabs>("featured-products");

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

                <Tabs aria-label="Product Tabs" variant="default">
                    {tabs.map((tab) => {
                        return (
                            <Tabs.Item
                                key={tab.key}
                                active={tab.key === activeTab}
                                title={tab.title}
                                onClick={() => setActiveTab(tab.key)}
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
