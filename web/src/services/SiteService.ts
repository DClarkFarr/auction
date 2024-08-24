import { Category } from "../types/Product";
import apiClient from "./apiClient";

export default class SiteService {
    static async getCategories() {
        return apiClient
            .get<Category[]>("/site/categories")
            .then((res) => res.data);
    }
}
