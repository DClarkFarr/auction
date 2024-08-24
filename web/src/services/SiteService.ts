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
}
