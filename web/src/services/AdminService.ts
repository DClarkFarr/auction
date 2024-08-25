import { CreateProductFormState } from "../components/product/CreateProductForm";
import { UpdateProductFormState } from "../components/product/UpdateProductForm";
import { PaginatedResults } from "../types/Paginate";
import {
    Category,
    FullProduct,
    Image,
    Product,
    ProductDetailItem,
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

    static updateProductDetailItems(
        idProduct: number,
        items: ProductDetailItem[]
    ) {
        return apiClient
            .post<FullProduct>(`/admin/products/${idProduct}/items`, { items })
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
}
