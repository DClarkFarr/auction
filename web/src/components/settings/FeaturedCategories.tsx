import { Alert, Spinner } from "flowbite-react";
import useSettingContext from "../../hooks/useSettingContext";
import { ScopedSetting } from "../../providers/ScopedSettingProvider";
import { FeaturedProduct } from "../../types/SiteSetting";

export default function SettingsFeaturedCategories() {
    return (
        <ScopedSetting setting="featuredCategories">
            <ManageFeaturedCategories />
        </ScopedSetting>
    );
}

const defaultFeaturedCategories: FeaturedProduct[] = [];
function ManageFeaturedCategories() {
    const { setting, isLoading, isSuccess, error } =
        useSettingContext<"featuredCategories">();

    const featuredCategories = setting || defaultFeaturedCategories;

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
                    Error loading featured Categories
                </div>
                <div>{error.message}</div>
            </Alert>
        );
    }

    return <div> We got: {JSON.stringify(featuredCategories)}</div>;
}
