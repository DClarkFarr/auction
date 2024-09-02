import { PaginatedProductParams } from "../services/SiteService";
import { FullProductItem } from "../types/Product";
import { contextFactory } from "../utils/context";

export type ProductsContext = {
    params: PaginatedProductParams;
    pagination: { limit: number; total: number; pages: number; page: number };
    products: FullProductItem[];
    isLoading: boolean;
    isSuccess: boolean;
    error: Error | null;
    setParams: (params: Partial<PaginatedProductParams>) => void;
    toggleCategory: (idCategory: number) => void;
    setPage: (pageNum: number) => void;
};
export const [ProductsContext, useProductsContext] =
    contextFactory<ProductsContext>();
