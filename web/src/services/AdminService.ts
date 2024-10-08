import { UpdateCategoryFormState } from "../components/category/UpdateCategoryForm";
import { CreateProductFormState } from "../components/product/CreateProductForm";
import { UpdateProductFormState } from "../components/product/UpdateProductForm";
import { WithBids } from "../types/Bid";
import { PaginatedResults } from "../types/Paginate";
import {
    Category,
    FullCategory,
    FullProduct,
    Image,
    Product,
    ProductDetailItem,
    ProductItem,
    ProductStatus,
    Tag,
    WithCategory,
} from "../types/Product";
import { User } from "../types/User";
import apiClient from "./apiClient";

type ImageBase = { id: string; status: boolean };
type ImageUploadSuccess = ImageBase & { image: Image };
type ImageUploadFailure = ImageBase & { filename: string; message: string };
type ImageUploadResponse = (ImageUploadFailure | ImageUploadSuccess)[];

export function isImageUploadSuccess(
    response: ImageUploadFailure | ImageUploadSuccess
): response is ImageUploadSuccess {
    return response.status === true;
}

export default class AdminService {
    static getUsers() {
        return apiClient.get<User[]>("/admin/users").then((res) => res.data);
    }

    static getPaginatedCategories({ page }: { page: number }) {
        return apiClient
            .get<PaginatedResults<FullCategory>>("/admin/categories", {
                params: { page },
            })
            .then((res) => res.data);
    }

    static getCategory(idCategory: number) {
        return apiClient
            .get<FullCategory>(`/admin/categories/${idCategory}`)
            .then((res) => res.data);
    }
    static updateCategory(idCategory: number, data: UpdateCategoryFormState) {
        return apiClient
            .put<FullCategory>(`/admin/categories/${idCategory}`, data)
            .then((res) => res.data);
    }
    static uploadCategoryImage(idCategory: number, file: File) {
        const fd = new FormData();
        fd.append("file", file);
        return apiClient
            .post<FullCategory>(`/admin/categories/${idCategory}/image`, fd)
            .then((res) => res.data);
    }
    static deleteCategoryImage(idCategory: number) {
        return apiClient
            .delete<FullCategory>(`/admin/categories/${idCategory}/image`)
            .then((res) => res.data);
    }

    static createCategory(data: UpdateCategoryFormState) {
        return apiClient
            .post<FullCategory>("/admin/categories", data)
            .then((res) => res.data);
    }

    static getProduct(idProduct: number) {
        return apiClient
            .get<FullProduct>(`/admin/products/${idProduct}`)
            .then((res) => res.data);
    }

    static getProductInventory(idProduct: number) {
        return apiClient
            .get<WithBids<ProductItem>[]>(
                `/admin/products/${idProduct}/inventory`
            )
            .then((res) => res.data);
    }

    static updateProduct(idProduct: number, data: UpdateProductFormState) {
        return apiClient
            .put<FullProduct>(`/admin/products/${idProduct}`, data)
            .then((res) => res.data);
    }

    static setProductStatus(idProduct: number, status: ProductStatus) {
        return apiClient
            .put(`/admin/products/${idProduct}/status`, { status })
            .then(() => {});
    }

    static updateProductDetailItems(
        idProduct: number,
        items: ProductDetailItem[]
    ) {
        return apiClient
            .post<FullProduct>(`/admin/products/${idProduct}/items`, { items })
            .then((res) => res.data);
    }

    static getProducts(data: {
        status: Product["status"][];
        page: number;
        limit: number;
        withImages?: boolean;
    }) {
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

    static createProductCategory(idProduct: number, categoryLabel: string) {
        return apiClient
            .post<Category>(`/admin/products/${idProduct}/categories`, {
                label: categoryLabel,
            })
            .then((res) => res.data);
    }

    static createProductTag(idProduct: number, tagLabel: string) {
        return apiClient
            .post<Tag>(`/admin/products/${idProduct}/tags`, {
                label: tagLabel,
            })
            .then((res) => res.data);
    }

    static setProductCategory(idProduct: number, idCategory: number) {
        return apiClient
            .put<Category>(`/admin/products/${idProduct}/categories`, {
                idCategory,
            })
            .then((res) => res.data);
    }

    static setProductTags(idProduct: number, idTags: number[]) {
        return apiClient
            .put<Category>(`/admin/products/${idProduct}/tags`, {
                idTags,
            })
            .then((res) => res.data);
    }

    static uploadProductImages(idProduct: number, fd: FormData) {
        return apiClient
            .post<ImageUploadResponse>(
                `/admin/products/${idProduct}/images`,
                fd,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((res) => res.data);
    }

    static deleteProductImage(idProduct: number, idImage: number) {
        return apiClient
            .delete(`/admin/products/${idProduct}/images/${idImage}`)
            .then(() => {});
    }

    static saveSetting(key: string, value: object) {
        return apiClient
            .post(`/admin/site/setting/${key}`, { value })
            .then((res) => res.data);
    }
}
