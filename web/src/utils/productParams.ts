import { PaginatedProductParams } from "../services/SiteService";

const arrayKeys = ["categoryIds", "productIds"];
const stringKeys = ["sortBy"];
const keys = [
    "page",
    "limit",
    "sortBy",
    "categoryIds",
    "productIds",
    "quality",
    "priceMin",
    "priceMax",
] as (keyof PaginatedProductParams)[];

export const defaultProductParams: PaginatedProductParams = {
    page: 1,
    limit: 20,
    sortBy: null,
    categoryIds: [],
    productIds: [],
    quality: null,
    priceMin: null,
    priceMax: null,
};

export function getProductQueryParams(search: URLSearchParams) {
    const params = keys.reduce((acc, key) => {
        if (arrayKeys.includes(key)) {
            const val = search.getAll(key);
            return {
                ...acc,
                [key]: (val || []).map(Number).filter((v) => !isNaN(v)),
            };
        }

        if (stringKeys.includes(key)) {
            return {
                ...acc,
                [key]: search.get(key) || defaultProductParams[key],
            };
        }

        const val = Number(search.get(key));
        return {
            ...acc,
            [key]:
                !isNaN(val) && search.get(key) !== null
                    ? val
                    : defaultProductParams[key],
        };
    }, {} as Partial<PaginatedProductParams>);

    return params as PaginatedProductParams;
}

export function setProductQueryParams(
    params: PaginatedProductParams,
    search: URLSearchParams
) {
    const prevKeys = Array.from(search.keys());
    const paramKeys = Object.keys(params);

    const otherKeys = prevKeys.reduce((acc, key) => {
        if (!paramKeys.includes(key)) {
            return { ...acc, [key]: search.get(key) };
        }
        return acc;
    }, {});

    const paramsToSet = Object.entries(params).reduce((acc, [key, val]) => {
        if (arrayKeys.includes(key)) {
            if (
                Array.isArray(val) &&
                val.length &&
                JSON.stringify(val) !==
                    JSON.stringify(
                        defaultProductParams[
                            key as keyof PaginatedProductParams
                        ]
                    )
            ) {
                return { ...acc, [key]: val.map(String) };
            }
        } else if (
            val &&
            val !== defaultProductParams[key as keyof PaginatedProductParams]
        ) {
            return { ...acc, [key]: String(val) };
        }

        return acc;
    }, {} as Record<string, string | string[]>);

    delete paramsToSet.page;

    return { ...otherKeys, ...paramsToSet };
}

export function filterDefaultProductParams(params: PaginatedProductParams) {
    return Object.entries(params).reduce((acc, [key, val]) => {
        if (arrayKeys.includes(key) && Array.isArray(val) && val.length) {
            return { ...acc, [key]: val };
        } else if (val) {
            return { ...acc, [key]: val };
        }

        return acc;
    }, {} as PaginatedProductParams);
}

export function makePaginatedActiveItemsKey(
    locationKey: string,
    { page, ...params }: PaginatedProductParams
) {
    const arr = ["paginatedActiveItems", locationKey];

    const joinValues = (
        key: string,
        value: string | null | number | number[]
    ) => {
        let str = key + ":";
        if (Array.isArray(value)) {
            str += value.join("|");
        } else if (value) {
            str += String(value);
        } else {
            str += "default";
        }

        return str;
    };

    Object.entries(params).forEach(([key, value]) => {
        arr.push(joinValues(key, value));
    });

    arr.push(`page:${page}`);

    return arr;
}
