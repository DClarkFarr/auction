export type ValueOf<T extends object> = T[keyof T];

export type FeaturedProduct = {
    uuid: string;
    id_product: number;
    name: string;
    description: string;
    image: string;
    order: number;
};

export type FeaturedCategory = {
    uuid: string;
    id_category: number;
    name: string;
    description: string;
    image: string;
    order: number;
};

export type SiteSettings = {
    featuredProducts: FeaturedProduct[];
    featuredCategories: FeaturedCategory[];
};

export type SiteSetting = keyof SiteSettings;
