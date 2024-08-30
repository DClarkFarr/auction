import { Category, Tag } from "../types/Product";
import apiClient from "./apiClient";

export default class SiteService {
    static async getTags() {
        return apiClient.get<Tag[]>("/site/tags").then((res) => res.data);
    }
    static async getCategories() {
        return apiClient
            .get<Category[]>("/site/categories")
            .then((res) => res.data);
    }

    static async getSetting<D>(key: string) {
        return apiClient
            .get<{ value: D }>(`/site/setting/${key}`)
            .then((res) => res.data.value);
    }

    static async getSettings(keys: string[]) {
        return apiClient
            .get("/site/settings", { params: { keys } })
            .then((res) => res.data);
    }
}
