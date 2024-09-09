import { DateTime } from "luxon";
import UserError from "../errors/UserError.js";
import CategoryModel from "../models/CategoryModel.js";
import ImageModel from "../models/ImageModel.js";
import ProductModel from "../models/ProductModel.js";
import TagModel from "../models/TagModel.js";
import { getPrisma } from "../prisma/client.js";
import { toSlug } from "../utils/slug.js";
import { Prisma } from "@prisma/client";

import fs from "fs";
import path from "path";
import ProductItemModel from "../models/ProductItemModel.js";
import { keyBy, random } from "lodash-es";
import SiteService from "./SiteService.js";
import { formatCurrency } from "../utils/format.js";

/**
 * @typedef {import('../models/ProductModel.js').ProductDocument} ProductDocument
 * @typedef {import('../models/ProductItemModel.js').ProductItemDocument} ProductItemDocument
 * @typedef {import("@prisma/client").ProductItem} ProductItem
 * @typedef {import("@prisma/client").Category} CategoryDocument
 * @typedef {import("../models/ImageModel.js").ImageDocument} ImageDocument
 * @typedef {import("@prisma/client").Bid} BidDocument
 * @typedef {import("@prisma/client").User} UserDocument
 * @typedef {ProductDocument['status']} ProductStatus
 * @typedef {ProductItemDocument['status']} ProductItemStatus
 */

/**
 * @type {ProductStatus[]}
 */
const PRODUCT_STATUSES = [
    "active",
    "inactive",
    "scheduled",
    "archived",
    "sold",
];

const SORT_OPTIONS = {
    expiring: ["i.expiresAt", "asc"],
    name: ["p.name", "asc"],
    quality: ["p.quality", "desc"],
    lowStock: ["p.remainingQuantity", "asc"],
    lowPrice: ["COALESCE(b.amount, p.priceInitial)", "asc"],
};
export default class ProductService {
    /**
     *
     * @param {ProductDocument} product
     * @param {ProductItemDocument} item
     * @param {ProductItemStatus} status
     * @param {Partial<ProductItemDocument>} extra - set user info when purchasing
     */
    static async publishProductItemStatus(product, item, status, extra = {}) {
        if (status === "active") {
            throw new Error('Cannot publish product item status "active"');
        }

        const prisma = getPrisma();

        const wasActive = item.status === "active";
        const needsRefund = ["canceled", "expired", "rejected"].includes(
            status
        );

        /**
         * @type {Partial<ProductItemDocument>}
         */
        const toSet = { ...extra, status };
        if (status === "canceled") {
            toSet.canceledAt = new Date();
        } else if (status === "expired") {
            toSet.expiredAt = new Date();
        } else if (status === "claimed") {
            toSet.claimedAt = new Date();
        } else if (status === "rejected") {
            const highestBid = await this.getProductItemHighestBid(item);
            if (!highestBid) {
                throw new Error(
                    "how can product be rejected and not have a bid?"
                );
            }
            toSet.rejectedAt = new Date();
        } else if (status === "purchased") {
            toSet.purchasedAt = new Date();
        }

        let updatedItem = await prisma.productItem.update({
            where: {
                id_item: item.id_item,
            },
            data: toSet,
        });

        let publishedItems = [];
        if (product.status === "active" && needsRefund) {
            await this.adjustRemainingQuantity(product, 1);

            publishedItems.push(
                ...(await ProductService.publishNextBatch(product, 1))
            );
        }

        return {
            publishedItems,
            product: {
                ...product,
                remainingQuantity: product.remainingQuantity + 1,
            },
        };
    }

    /**
     *
     * @param {ProductItemDocument} item
     */
    static async getProductItemHighestBid(item) {
        const prisma = getPrisma();
        return prisma.bid.findFirst({
            where: {
                id_item: item.id_item,
                status: "active",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    /**
     * @param {ProductStatus} status
     */
    isValidStatus(status) {
        return PRODUCT_STATUSES.includes(status);
    }

    /**
     * @param {number} idProduct
     * @param {ProductStatus} status
     */
    static async publishProductStatus(idProduct, status) {
        const productModel = new ProductModel();
        const product = await productModel.findById(idProduct);

        if (!product) {
            throw new Error("Product not found");
        }

        if (status === product.status) {
            /**
             * If status is inactive, but scheduledFor is set, let it through.
             */
            if (
                (status === "inactive" && !product.scheduledFor) ||
                status !== "inactive"
            ) {
                throw new Error("Product status is already " + status);
            }
        }

        switch (status) {
            case "active":
                await this.activateProduct(product);
                break;
            case "inactive":
                await this.deactivateProduct(product);
                break;
            case "archived":
                await this.archiveProduct(product);
                break;
            case "scheduled":
                await this.deactivateProduct(product, {
                    scheduledFor: null,
                });
                break;
            case "sold":
                await this.markSoldProduct(product);
                break;
            default:
                throw new Error("Unrecognized status: " + status);
        }
    }

    /**
     * @param {ProductDocument} product
     */
    static async markSoldProduct(product) {
        // cancel active items, if any, and adjust remaining
        const items = await this.cancelActiveItemsAndAdjustRemaining(product);

        await this.setProductStatus(product, "sold", {
            scheduledFor: null,
            remainingQuantity: 0,
        });

        return items;
    }

    /**
     * @param {ProductDocument} product
     */
    static async archiveProduct(product) {
        // cancel active items, if any, and adjust remaining
        const items = await this.cancelActiveItemsAndAdjustRemaining(product);

        await this.setProductStatus(product, "archived", {
            scheduledFor: null,
        });

        return items;
    }

    /**
     * @param {ProductDocument} product
     */
    static async deactivateProduct(product, extra = {}) {
        // cancel active items, if any, and adjust remaining
        const items = await this.cancelActiveItemsAndAdjustRemaining(product);

        await this.setProductStatus(product, "inactive", extra);

        return items;
    }

    /**
     * @param {ProductDocument} product
     */
    static async cancelActiveItemsAndAdjustRemaining(product) {
        // get refund quantity amount
        const toCancel = await this.getActiveProductItems(product);

        // adjust + remaining quantity
        if (toCancel.length) {
            const maxUpdateable = product.initialQuantity - toCancel.length;

            await this.adjustRemainingQuantity(
                product,
                Math.min(toCancel.length, maxUpdateable)
            );
            await this.cancelActiveProductItems(product);
        }

        return toCancel;
    }

    static async cancelActiveProductItems(product) {
        const productItemModel = new ProductItemModel();

        return productItemModel.table.updateMany({
            where: {
                id_product: product.id_product,
            },
            data: {
                status: "canceled",
                canceledAt: new Date(),
            },
        });
    }

    /**
     * @param {ProductDocument} product
     */
    static async getActiveProductItems(product) {
        const productItemModel = new ProductItemModel();

        return productItemModel.table.findMany({
            where: {
                id_product: product.id_product,
                status: "active",
            },
        });
    }

    /**
     * @param {ProductDocument} product
     */
    static async activateProduct(product) {
        const items = await this.publishNextBatch(product);

        // set product.status = active
        const latestProduct = await this.setProductStatus(product, "active");

        return { items, product: latestProduct };
    }

    /**
     * @param {ProductDocument} product
     */
    static async publishNextBatch(product, overrideBatchSize = null) {
        if (product.remainingQuantity < 1) {
            throw new Error(
                "Product currently has no quantity remaining. Update, then attempt activation."
            );
        }
        // get product batch count. "available quantity" - "batch count"
        const toCreate = this.getNextPublishBatchCount(
            product,
            overrideBatchSize
        );

        // create items
        const items = await this.createAndPublishProductItems(
            product,
            toCreate
        );

        // subtract remaining items
        await this.adjustRemainingQuantity(product, -toCreate);

        return items;
    }

    /**
     * @param {ProductDocument} product
     * @param {number} toCreate
     */
    static async createAndPublishProductItems(product, toCreate) {
        /**
         * @type {ProductItemDocument}
         */
        const toSet = {
            id_product: product.id_product,
            status: "active",
            expiresAt: DateTime.now().plus({ hours: 24 }).toJSDate(),
        };

        const productItemModel = new ProductItemModel();

        const items = await Promise.all(
            Array.from({ length: toCreate }).map(() => {
                return productItemModel.create({ ...toSet });
            })
        );

        return items;
    }

    /**
     * @param {ProductDocument} product
     * @param {number} adjustment
     */
    static async adjustRemainingQuantity(product, adjustment) {
        const productModel = new ProductModel();

        const adjusted = product.remainingQuantity + adjustment;
        if (adjusted < 0) {
            throw new Error("Remaining quantity was below 0");
        }
        await productModel.update(product.id_product, {
            remainingQuantity: adjusted,
        });
    }

    /**
     * @param {ProductDocument} product
     */
    static getNextPublishBatchCount(product, overrideBatchSize = null) {
        const batchSize = overrideBatchSize || product.auctionBatchCount;
        const remainingQuantity = product.remainingQuantity;

        const toCreate =
            remainingQuantity < batchSize ? remainingQuantity : batchSize;

        return toCreate;
    }

    /**
     * @param {ProductDocument} product
     * @param {ProductStatus} status
     * @param {Partial<ProductDocument>} extra
     */
    static async setProductStatus(product, status, extra = {}) {
        const productModel = new ProductModel();

        return productModel.update(product.id_product, {
            ...extra,
            status,
        });
    }

    static async deleteProductImage(idProduct, idImage) {
        const imageModel = new ImageModel();

        const del = await imageModel.table.delete({
            where: {
                resourceId: idProduct,
                resourceType: "product",
                id_image: idImage,
            },
        });

        if (del) {
            fs.unlinkSync(path.join("./uploads", del.path));
        }
    }
    static async setProductTags(idProduct, idtags) {
        await this.addProductTags(idProduct, idtags, true);
    }

    static async setProductCategory(idProduct, idCategory) {
        await this.attachProductCategory(idProduct, idCategory);
    }

    static async attachProductCategory(idProduct, idCategory) {
        const client = getPrisma();

        await client.productCategories.deleteMany({
            where: {
                productId: idProduct,
            },
        });

        // Then, create the new relationship
        await client.productCategories.create({
            data: {
                productId: idProduct,
                categoryId: idCategory,
            },
        });
    }

    static async addProductTags(idProduct, idTags, clear = false) {
        const client = getPrisma();
        const productId = parseInt(idProduct);
        const tagIds = idTags.map((v) =>
            typeof v === "number" ? v : parseInt(v)
        );

        if (clear) {
            const joinIds = tagIds.length ? tagIds.join(",") : "NULL";
            await client.$queryRaw`DELETE FROM ProductTags WHERE productId=${productId} AND tagId NOT IN(${joinIds})`;
        }

        if (!tagIds.length) {
            return;
        }

        const sql = `INSERT INTO ProductTags (productId, tagId)
        SELECT ${productId}, id_tag FROM Tag
        WHERE id_tag IN(${Array.from({ length: tagIds.length }, () => "?").join(
            ","
        )})
        ON DUPLICATE KEY UPDATE
        productId = ${productId}, tagId = id_tag`;

        const query = Prisma.raw(sql);

        // inputString can be untrusted input
        query.values = tagIds;

        const result = await client.$queryRaw(query);
    }

    static async createProductTag(idProduct, tagLabel) {
        const tagModel = new TagModel();

        const slug = toSlug(tagLabel);

        let tag = await tagModel.findBySlug(slug);
        if (!tag) {
            tag = await tagModel.create({ label: tagLabel });
        }

        await this.addProductTags(idProduct, [tag.id_tag]);

        return tag;
    }

    static async createProductCategory(idProduct, categoryLabel) {
        const categoryModel = new CategoryModel();

        const slug = toSlug(categoryLabel);

        let category = await categoryModel.findBySlug(slug);
        if (!category) {
            category = await categoryModel.create({ label: categoryLabel });
        }

        await this.attachProductCategory(idProduct, category.id_category);

        return category;
    }

    static async updateProductDetails(idProduct, detailItems) {
        if (!Array.isArray(detailItems)) {
            throw new UserError("Product items should be an array");
        }

        if (
            detailItems.some((item) => {
                return (
                    Object.keys(item).length !== 2 ||
                    !item.label ||
                    !item.description
                );
            })
        ) {
            throw new UserError(
                "Malformed product item data. Must have label and description keys"
            );
        }

        const productModel = new ProductModel();
        return productModel.update(idProduct, { detailItems });
    }
    static async getProductImages(idProduct) {
        const imageModel = new ImageModel();
        return imageModel.findByResource("product", idProduct);
    }

    static async updateProduct(id, toSet) {
        const productModel = new ProductModel();
        const prev = await productModel.table.findFirst({
            where: { id_product: id },
        });
        if (!prev) {
            throw new UserError("Product not found: " + id);
        }

        if (typeof toSet.remainingQuantity === "undefined") {
            toSet.remainingQuantity = toSet.initialQuantity;
        }

        if (typeof toSet.scheduledFor === "string" && !toSet.scheduledFor) {
            toSet.scheduledFor = null;
        }

        const product = await productModel.update(id, toSet);

        return product;
    }

    static async createProduct(data) {
        const productModel = new ProductModel();
        const created = await productModel.create(data);

        return created;
    }

    static async getPaginatedProducts({
        status,
        page,
        limit,
        withImages = false,
        withCategories = true,
    }) {
        const productModel = new ProductModel();
        const total = await productModel.table.count({
            where: {
                status: {
                    in: status,
                },
            },
        });

        const rows = await productModel.table.findMany({
            where: {
                status: {
                    in: status,
                },
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: page * limit - limit,
        });

        if (withCategories) {
            rows.forEach((row) => this.applyProductCategories(row));
        }

        if (withImages) {
            await Promise.all(rows.map((row) => this.applyProductImages(row)));
        }

        return {
            limit,
            page,
            rows,
            total,
            pages: Math.ceil(total / limit),
        };
    }

    static async applyProductImages(product) {
        product.images = await this.getProductImages(product.id_product);
    }

    static applyProductCategories(product) {
        product.category = product.categories?.[0]?.category || null;

        delete product.categories;
    }

    static applyProductTags(product) {
        product.tags = product.tags?.map((t) => t.tag) || [];
    }

    static async getProductById(idProduct) {
        const productModel = new ProductModel();
        const product = await productModel.table.findFirst({
            where: {
                id_product: idProduct,
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        this.applyProductCategories(product);
        this.applyProductTags(product);
        await this.applyProductImages(product);

        return product;
    }

    static getValidSortBy(sortBy, fallback) {
        let tuple = SORT_OPTIONS[sortBy];
        if (!tuple) {
            tuple = fallback;
        }

        return `${tuple[0]} ${tuple[1].toUpperCase()}`;
    }

    static getSafeNumber(num) {
        return isNaN(num) ? null : Number(num);
    }

    /**
     *
     * @param {ProductDocument[]} products
     */
    static async applyProductsCategory(products) {
        const prisma = getPrisma();
        const productIds = products.map((p) => p.id_product);

        /**
         * @type {CategoryDocument[]}
         */

        const categories =
            await prisma.$queryRaw`SELECT c.*, pc.productId AS id_product 
            FROM Category c 
            JOIN ProductCategories pc ON pc.categoryId = c.id_category
            WHERE pc.productId IN(${Prisma.join(productIds)})`;
        /**
         * @type {Record<number, CategoryDocument>}
         */
        const categoriesKeyed = keyBy(categories, "id_product");

        return products.map((p) => {
            return { ...p, category: categoriesKeyed[p.id_product] || null };
        });
    }

    /**
     * @param {ProductDocument[]} products
     */
    static async applyProductsImages(products) {
        const prisma = getPrisma();
        const productIds = products.map((p) => p.id_product);

        const images = await prisma.image.findMany({
            where: {
                resourceType: "product",
                resourceId: {
                    in: productIds,
                },
            },
        });

        /**
         * @type {Record<number, ImageDocument>}
         */
        const imageskeyed = images.reduce((acc, image) => {
            if (!acc[image.resourceId]) {
                acc[image.resourceId] = [];
            }
            acc[image.resourceId].push(image);

            return acc;
        }, {});

        return products.map((p) => {
            return { ...p, images: imageskeyed[p.id_product] || [] };
        });
    }

    /**
     * @param {ProductItem[]} items
     */
    static async applyItemsProducts(items) {
        const prisma = getPrisma();
        const productIds = items.map((i) => i.id_product);

        let products = await prisma.product.findMany({
            where: {
                id_product: {
                    in: productIds,
                },
            },
        });

        if (products.length) {
            products = await this.applyProductsCategory(products);
            products = await this.applyProductsImages(products);
        }

        /**
         * @type {Record<number, ProductDocument>}
         */
        const productsKeyed = keyBy(products, "id_product");

        return items.map((i) => {
            return { ...i, product: productsKeyed[i.id_product] || null };
        });
    }

    /**
     * @param {ProductItem[]} items
     */
    static async applyItemsHighestBids(items) {
        const prisma = getPrisma();
        const itemIds = items.map((i) => i.id_item);

        /**
         * @type {Record<number, BidDocument>}
         */
        const bidsKeyed = keyBy(
            await prisma.$queryRaw`SELECT * FROM Bid b
                INNER JOIN (
                    SELECT id_item, MAX(amount) AS amount
                    FROM Bid
                    WHERE id_item IN(${Prisma.join(itemIds)})
                    AND status = 'active'
                    GROUP BY id_item
                ) max ON b.id_item = max.id_item AND b.amount >= max.amount
                WHERE b.id_item IN(${Prisma.join(itemIds)})
                AND b.status = 'active'
                `,
            "id_item"
        );

        return items.map((i) => {
            return { ...i, bid: bidsKeyed[i.id_item] || null };
        });
    }

    /**
     * @param {{
     * sortBy: string;
     * categoryIds: number[];
     * page: number;
     * limit: number;
     * quality: number;
     * priceMin: number;
     * priceMax: number;
     * productIds: number[];
     * itemIds: number[];
     * }} params
     */
    static async getPaginatedProductItems(params, filterActive = true) {
        const { items, total, formattedParams } =
            await this.queryPaginatedProductItems(params, filterActive);

        let populatedItems = [];

        if (items.length) {
            populatedItems = await this.applyItemsProducts(items);
            populatedItems = await this.applyItemsHighestBids(populatedItems);
        }

        const final = {
            total,
            rows: populatedItems,
            page: formattedParams.page,
            pages: Math.ceil(total / formattedParams.limit),
            limit: formattedParams.limit,
        };

        return final;
    }

    /**
     * @param {{
     *   sortBy: string;
     *   categoryIds: number[];
     *   page: number;
     *   limit: number;
     *   quality: number;
     *   priceMin: number;
     *   priceMax: number;
     *   productIds: number[];
     *   itemIds: number[];
     * }} params
     * @param {boolean} activeOnly
     */
    static async queryPaginatedProductItems(
        {
            sortBy: sortByRaw = SORT_OPTIONS.expiring,
            categoryIds: categoryIdsRaw = null,
            page: pageRaw = 1,
            limit: limitRaw = 20,
            quality: qualityRaw = null,
            priceMin: priceMinRaw = null,
            priceMax: priceMaxRaw = null,
            productIds: productIdsRaw = null,
            itemIds: itemIdsRaw = null,
        } = {},
        filterActive = true
    ) {
        const sortBy = this.getValidSortBy(sortByRaw, SORT_OPTIONS.expiring);

        const categoryIds =
            Array.isArray(categoryIdsRaw) &&
            categoryIdsRaw.map(Number).filter(Boolean);
        const productIds =
            Array.isArray(productIdsRaw) &&
            productIdsRaw.map(Number).filter(Boolean);
        const itemIds =
            Array.isArray(itemIdsRaw) && itemIdsRaw.map(Number).filter(Boolean);

        const page = this.getSafeNumber(pageRaw);
        const limit = this.getSafeNumber(limitRaw);
        const quality = this.getSafeNumber(qualityRaw);
        const priceMin = this.getSafeNumber(priceMinRaw);
        const priceMax = this.getSafeNumber(priceMaxRaw);

        const parts = {
            selectTotal: "SELECT COUNT(*) as total ",
            selectFields:
                "SELECT i.*, COALESCE(b.amount, p.priceInitial) AS currentPrice ",
            from: `FROM Product p 
            JOIN ProductItem i ON p.id_product = i.id_product 
            LEFT JOIN (
                SELECT b.id_item, MAX(b.amount) AS amount, MAX(b.createdAt) as createdAt FROM Bid AS b
                WHERE b.status = 'active'
                GROUP BY b.id_item 
                ORDER BY MAX(b.createdAt) DESC
            ) as b ON b.id_item = i.id_item `,
            where: `WHERE 1 `,
            whereRecentlyExpired: `AND (i.expiresAt > DATE_SUB(NOW(), INTERVAL 6 HOUR) AND i.expiresAt < NOW()) `,
            whereNotExpired: ` AND i.status = 'active' AND i.expiresAt > NOW() `,
            order: (sb) => `ORDER BY ${sb} `,
            limit: (skip, take) => `LIMIT ${skip}, ${take} `,
        };

        if (categoryIds.length) {
            parts.where += `
            AND EXISTS (
                SELECT * from ProductCategories pc 
                WHERE pc.productId = p.id_product
                AND pc.categoryId IN(${categoryIds.join(",")})
            )`;
        }

        if (Array.isArray(productIds)) {
            parts.where += `
            AND p.id_product IN(${
                productIds.length ? productIds.join(",") : "NULL"
            })`;
        }

        if (Array.isArray(itemIds)) {
            parts.where += `
                AND i.id_item IN(${itemIds.length ? itemIds.join(",") : "NULL"})
            `;
        }

        if (quality > 0) {
            parts.where += `
            AND p.quality >= ${quality}`;
        }

        if (priceMin > 0) {
            parts.where += `
            AND COALESCE(b.amount, p.priceInitial) >= ${priceMin}`;
        }

        if (priceMax > 0) {
            parts.where += `
            AND COALESCE(b.amount, p.priceInitial) <= ${priceMax}`;
        }

        const prisma = getPrisma();

        let bigIntInactiveTotal = 0;

        if (filterActive) {
            const inactivesTotalQuery = `${parts.selectTotal} ${parts.from} ${
                parts.where
            } ${filterActive ? parts.whereRecentlyExpired : ""}`;

            const [{ total }] = await prisma.$queryRawUnsafe(
                inactivesTotalQuery
            );

            bigIntInactiveTotal = total;
        }

        const activesTotalQuery = `${parts.selectTotal} ${parts.from} ${
            parts.where
        } ${filterActive ? parts.whereNotExpired : ""}`;

        const [{ total: bigIntActiveTotal }] = await prisma.$queryRawUnsafe(
            activesTotalQuery
        );

        const inactivesTotal = Number(bigIntInactiveTotal);
        const activesTotal = Number(bigIntActiveTotal);

        const inactivesPerPage = 3;
        const maxPagesWithInactives =
            Math.floor(inactivesTotal / inactivesPerPage) ||
            (inactivesTotal ? 1 : 0);

        const totalSubtractedUntilNow =
            Math.min(page - 1, maxPagesWithInactives) * inactivesPerPage;
        const activesOffset = page * limit - limit - totalSubtractedUntilNow;

        let inactives = [];
        let items = [];

        const activePages = Math.ceil(activesTotal / limit);

        if (activesTotal > activesOffset) {
            /**
             * There are more products, so query them and splice in inactives
             */
            if (page <= maxPagesWithInactives && inactivesTotal > 0) {
                const inactivesQuery = `${parts.selectFields} ${parts.from} ${
                    parts.where
                } ${
                    filterActive ? parts.whereRecentlyExpired : ""
                } ${parts.order(
                    this.getValidSortBy("invalid", SORT_OPTIONS.expiring)
                )} ${parts.limit(
                    page * inactivesPerPage - inactivesPerPage,
                    inactivesPerPage
                )}`;

                inactives = await prisma.$queryRawUnsafe(inactivesQuery);
            }

            const activesQuery = `${parts.selectFields} ${parts.from} ${
                parts.where
            } ${filterActive ? parts.whereNotExpired : ""} ${parts.order(
                sortBy
            )} ${parts.limit(
                activesOffset,
                limit - (page <= maxPagesWithInactives ? inactivesPerPage : 0)
            )}`;

            items = await prisma.$queryRawUnsafe(activesQuery);

            if (inactives.length) {
                items = this.spliceInactivesIntoActivesArray(items, inactives);
            }
        } else if (page <= maxPagesWithInactives) {
            // how many did we lose on product pages?
            const baseOffset = activePages * inactivesPerPage;

            const inactivesQuery = `${parts.selectFields} ${parts.from} ${
                parts.where
            } ${filterActive ? parts.whereRecentlyExpired : ""} ${parts.order(
                this.getValidSortBy("invalid", SORT_OPTIONS.expiring)
            )} ${parts.limit(page * limit - limit - baseOffset, limit)}`;

            items = await prisma.$queryRawUnsafe(inactivesQuery);
        }

        const formattedParams = {
            categoryIds,
            productIds,
            page,
            limit,
            quality,
            priceMin,
            priceMax,
        };
        return {
            items,
            total: activesTotal + inactivesTotal,
            formattedParams,
        };
    }

    static spliceInactivesIntoActivesArray(actives, inactives) {
        const inserted = [...actives];
        for (let i = 0; i < inactives.length; i++) {
            const insertIndex = random(3, inserted.length - 2);
            inserted.splice(insertIndex, 0, inactives[i]);
        }

        return inserted;
    }

    static async getFeaturedProducts() {
        const setting = await SiteService.getSetting("featuredProducts");

        /**
         * @type {{
         *  name: string,
         *  uuid: string,
         *  image: string,
         *  order: number,
         *  description: string,
         *  id_product: number
         *  }[]}
         */
        const featuredProducts = setting?.value || {};

        const populated = (
            await Promise.all(
                featuredProducts.map(async (fp) => {
                    const product = await this.getProductById(fp.id_product);

                    if (product.status !== "active") {
                        return null;
                    }

                    const possiblyActiveItems =
                        await this.getActiveProductItems(product);

                    const now = DateTime.now();

                    const firstForSureActiveItem = possiblyActiveItems.find(
                        (i) => {
                            const expiresAt = DateTime.fromJSDate(i.expiresAt);

                            if (!i.claimedAt && expiresAt > now) {
                                return true;
                            }
                            return false;
                        }
                    );

                    if (!firstForSureActiveItem) {
                        return null;
                    }

                    const highestBid = await this.getProductItemHighestBid(
                        firstForSureActiveItem
                    );

                    return {
                        ...fp,
                        item: {
                            ...firstForSureActiveItem,
                            bid: highestBid,
                            product: product,
                        },
                    };
                })
            )
        ).filter((p) => !!p);

        return populated;
    }

    /**
     * @param {UserDocument} user
     * @param {number} idItem
     * @param {number} amount
     */
    static async placeProductBid(user, idItem, amount) {
        const prisma = getPrisma();

        const item = await prisma.productItem.findFirst({
            where: {
                id_item: idItem,
            },
        });

        if (!item) {
            throw new UserError("Item not found");
        }

        if (item.status !== "active") {
            throw new UserError("Cannot bid on " + item.status + " item");
        }

        if (DateTime.fromJSDate(item.expiresAt) < DateTime.now()) {
            throw new UserError("Product has expired");
        }

        const highestBid = await this.getProductItemHighestBid(item);

        const product = await this.getProductById(item.id_product);

        const minPrice = highestBid
            ? highestBid.amount + 1
            : product.priceInitial;

        if (amount < minPrice) {
            throw new UserError(
                "Minimum bid price is " + formatCurrency(minPrice)
            );
        }

        await prisma.bid.updateMany({
            where: {
                id_item: idItem,
            },
            data: {
                status: "inactive",
            },
        });

        const bid = await prisma.bid.create({
            data: {
                id_product: item.id_product,
                id_item: item.id_item,
                id_user: user.id,
                amount,
                status: "active",
            },
        });

        const expiresAtMin = DateTime.fromJSDate(item.expiresAt).minus({
            minutes: 5,
        });
        const now = DateTime.now();
        if (expiresAtMin < now) {
            const in5Min = now.plus({ minutes: 5 });

            await prisma.productItem.update({
                where: {
                    id_item: item.id_item,
                },
                data: {
                    expiresAt: in5Min.toJSDate(),
                },
            });

            item.expiresAt = in5Min.toJSDate();
        }

        return { ...item, bid, product };
    }
}
