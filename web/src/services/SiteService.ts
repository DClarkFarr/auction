import { PaginatedResults } from "../types/Paginate";
import { Category, FullProductItem, Tag, WithImage } from "../types/Product";
import { FeaturedCategory } from "../types/SiteSetting";
import apiClient from "./apiClient";

type WithProductCount<T, P> = P extends true ? T & { productCount: number } : T;
type CategoriesResponse<I, P> = WithProductCount<
    I extends true ? WithImage<Category> : Category,
    P
>;

export type FullFeaturedCategory = FeaturedCategory & {
    category: WithImage<Category>;
};

export type PaginatedProductParams = {
    sortBy: "active" | "inactive" | "scheduled" | "archived" | "sold" | null;
    categoryIds: number[] | null;
    page: number | null;
    limit: number | null;
    quality: number | null;
    priceMin: number | null;
    priceMax: number | null;
    productIds: number[] | null;
};
export default class SiteService {
    static async getTags() {
        return apiClient.get<Tag[]>("/site/tags").then((res) => res.data);
    }
    static async getCategories<I extends boolean, P extends boolean>({
        withImage,
        withProductCount,
    }: {
        withImage: I;
        withProductCount: P;
    }) {
        return apiClient
            .get<CategoriesResponse<I, P>[]>("/site/categories", {
                params: { withImage, withProductCount },
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

    static async getPaginatedActiveItems(
        params: Partial<PaginatedProductParams> = {}
    ) {
        return apiClient
            .get<PaginatedResults<FullProductItem>>(
                "/site/products/paginated",
                { params }
            )
            .then((res) => res.data);
    }
}
