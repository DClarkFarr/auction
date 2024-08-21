import { PaginatedResults } from "../types/Paginate";
import { Product } from "../types/Product";
import { User } from "../types/User";
import apiClient from "./apiClient";

export default class AdminService {
    static getUsers() {
        return apiClient.get<User[]>("/admin/users").then((res) => res.data);
    }

    static getProducts(data: { status: Product["status"][]; page: number }) {
        return apiClient
            .get<PaginatedResults<Product>>("/admin/products", {
                params: data,
            })
            .then((res) => res.data);
    }
}
