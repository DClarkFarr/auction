import { Alert, Spinner } from "flowbite-react";
import useSettingContext from "../../hooks/useSettingContext";
import { ScopedSetting } from "../../providers/ScopedSettingProvider";
import { FeaturedProduct } from "../../types/SiteSetting";

export default function SettingsFeaturedProducts() {
    return (
        <ScopedSetting setting="featuredProducts">
            <ManageFeaturedProducts />
        </ScopedSetting>
    );
}

const defaultFeaturedProducts: FeaturedProduct[] = [];
function ManageFeaturedProducts() {
    const { setting, isLoading, isSuccess, error } =
        useSettingContext<"featuredProducts">();

    const featuredProducts = setting || defaultFeaturedProducts;

    if (isLoading) {
        return (
            <div className="p-6">
                <Spinner />
            </div>
        );
    }

    if (!isSuccess && error) {
        return (
            <Alert color="failure">
                <div className="font-semibold">
                    Error loading featured Products
                </div>
                <div>{error.message}</div>
            </Alert>
        );
    }

    return <div> We got: {JSON.stringify(featuredProducts)}</div>;
}
