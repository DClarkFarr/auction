import { PaginatedProductParams } from "../services/SiteService";
import { PaginatedResults } from "../types/Paginate";
import { FullProductItem } from "../types/Product";
import { contextFactory } from "../utils/context";

export type ProductsContext = {
    params: PaginatedProductParams;
    queriedPagination: PaginatedResults<FullProductItem> | undefined;
    pagination: { limit: number; total: number; pages: number; page: number };
    products: FullProductItem[];
    isLoading: boolean;
    isSuccess: boolean;
    error: Error | null;
    useEndlessScrolling: boolean;
    setEndlessScrolling: (value: boolean) => void;
    setParams: (params: Partial<PaginatedProductParams>) => void;
    toggleCategory: (idCategory: number) => void;
    setPage: (pageNum: number) => void;
    setProducts: React.Dispatch<React.SetStateAction<FullProductItem[]>>;
};
export const [ProductsContext, useProductsContext] =
    contextFactory<ProductsContext>();
