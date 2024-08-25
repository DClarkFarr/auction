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

/**
 * @typedef {import('../models/ProductModel.js').ProductDocument} ProductDocument
 * @typedef {import('../models/ProductItemModel.js').ProductItemDocument} ProductItemDocument
 * @typedef {ProductDocument['status']} ProductStatus
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
export default class ProductService {
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
            throw new Error("Product status is already " + status);
        }

        switch (status) {
            case "active":
                await this.activateProduct(product);
                break;
            case "inactive":
                this.deactivateProduct(product);

                break;
            case "archived":
                break;
            case "scheduled":
                break;
            case "sold":
                break;
            default:
                throw new Error("Unrecognized status: " + status);
        }
    }

    /**
     * @param {ProductDocument} product
     */
    static async deactivateProduct(product) {
        // get refund quantity amount
        const toCancel = await this.getActiveProductItems(product);

        // adjust + remaining quantity
        if (toCancel.length) {
            const maxUpdateable = product.initialQuantity - toCancel.length;
            console.log(
                "max updateable",
                maxUpdateable,
                "from",
                toCancel.length
            );
            await this.adjustRemainingQuantity(
                product,
                Math.min(toCancel.length, maxUpdateable)
            );
            await this.cancelActiveProductItems(product);
        }

        await this.setProductStatus(product, "inactive");
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
    static async publishNextBatch(product) {
        if (product.remainingQuantity < 1) {
            throw new Error(
                "Product currently has no quantity remaining. Update, then attempt activation."
            );
        }
        // get product batch count. "available quantity" - "batch count"
        const toCreate = this.getNextPublishBatchCount(product);

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
    static getNextPublishBatchCount(product) {
        const batchSize = product.auctionBatchCount;
        const remainingQuantity = product.remainingQuantity;

        const toCreate =
            remainingQuantity < batchSize ? remainingQuantity : batchSize;

        return toCreate;
    }

    /**
     * @param {ProductDocument} product
     * @param {ProductStatus} status
     */
    static async setProductStatus(product, status) {
        const productModel = new ProductModel();

        return productModel.update(product.id_product, {
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

        rows.forEach((row) => this.applyProductCategories(row));

        return {
            limit,
            page,
            rows,
            total,
            pages: Math.ceil(total / limit),
        };
    }

    static async applyProductImages(product) {
        product.images = (await this.getProductImages(product.id_product)).map(
            (image) => {
                return { ...image, path: "/uploads/" + image.path };
            }
        );
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
}
