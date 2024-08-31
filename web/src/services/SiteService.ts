import { Category, Tag, WithImage } from "../types/Product";
import { FeaturedCategory } from "../types/SiteSetting";
import apiClient from "./apiClient";

type CategoriesResponse<I> = I extends true ? WithImage<Category> : Category;

export type FullFeaturedCategory = FeaturedCategory & {
    category: WithImage<Category>;
};
export default class SiteService {
    static async getTags() {
        return apiClient.get<Tag[]>("/site/tags").then((res) => res.data);
    }
    static async getCategories<I extends boolean>({
        withImage,
    }: {
        withImage: I;
    }) {
        return apiClient
            .get<CategoriesResponse<I>[]>("/site/categories", {
                params: { withImage },
            })
            .then((res) => res.data);
    }

    static async getFeaturedCategories() {
        return apiClient
            .get<FullFeaturedCategory[]>("/site/categories/featured")
            .then((res) => res.data);
    }

    static async getSetting<D>(key: string) {
        return apiClient
            .get<{ value: D }>(`/site/setting/${key}`)
            .then((res) => (res.data ? res.data.value : null));
    }

    static async getSettings(keys: string[]) {
        return apiClient
            .get("/site/settings", { params: { keys } })
            .then((res) => res.data);
    }
}
