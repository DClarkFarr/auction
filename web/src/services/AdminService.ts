import { CreateProductFormState } from "../components/product/CreateProductForm";
import { UpdateProductFormState } from "../components/product/UpdateProductForm";
import { PaginatedResults } from "../types/Paginate";
import { FullProduct, Product, WithCategory } from "../types/Product";
import { User } from "../types/User";
import apiClient from "./apiClient";

export default class AdminService {
    static getUsers() {
        return apiClient.get<User[]>("/admin/users").then((res) => res.data);
    }

    static getProduct(idProduct: number) {
        return apiClient
            .get<FullProduct>(`/admin/products/${idProduct}`)
            .then((res) => res.data);
    }

    static updateProduct(idProduct: number, data: UpdateProductFormState) {
        return apiClient
            .put<FullProduct>(`/admin/products/${idProduct}`, data)
            .then((res) => res.data);
    }

    static getProducts(data: { status: Product["status"][]; page: number }) {
        return apiClient
            .get<PaginatedResults<WithCategory<Product>>>("/admin/products", {
                params: data,
            })
            .then((res) => res.data);
    }

    static createProduct(data: CreateProductFormState) {
        return apiClient
            .post<Product>("/admin/products", data)
            .then((res) => res.data);
    }
}
