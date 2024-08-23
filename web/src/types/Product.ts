export type ProductDetailItem = {
    label: string;
    description: string;
};

export type ProductStatus =
    | "active"
    | "inactive"
    | "scheduled"
    | "archived"
    | "sold";

export type ProductQuality = 1 | 2 | 3 | 4 | 5;

export type Product = {
    id_product: number;
    sku: string;
    name: string;
    slug: string;
    priceCost: number;
    priceInitial: number;
    priceRetail: number;
    initialQuantity: number;
    remainingQuantity: number;
    quality: ProductQuality;
    auctionBatchCount: number;
    description: string;
    detailItems: ProductDetailItem[];
    status: ProductStatus;
    scheduledFor: string | undefined;
    createdAt: string;
};

export type Category = {
    id_category: number;
    label: string;
    slug: string;
};

export type Tag = {
    id_tag: number;
    label: string;
    slug: string;
};

export type ImageResourceType = "product";

export type Image = {
    id_image: number;
    resourceType: ImageResourceType;
    resourceId: number;
    path: string;
    alt: string;
};

export type WithCategory<T> = T & { category: Category | null };
export type WithTags<T> = T & { tags: Tag[] };
export type WithImages<T> = T & { images: Image[] };

export type FullProduct = WithCategory<WithTags<WithImages<Product>>>;
