import SiteService, { PaginatedProductParams } from "../services/SiteService";
import { contextFactory } from "../utils/context";

export type ProductsContext = {
    params: PaginatedProductParams;
    pagination:
        | Awaited<ReturnType<typeof SiteService.getPaginatedActiveItems>>
        | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    error: Error | null;
    setParams: (params: Partial<PaginatedProductParams>) => void;
    toggleCategory: (idCategory: number) => void;
    setPage: (pageNum: number) => void;
};
export const [ProductsContext, useProductsContext] =
    contextFactory<ProductsContext>();
