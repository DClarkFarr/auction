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

export default class ProductService {
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
        await ProductService.addProductTags(idProduct, idtags, true);
    }

    static async setProductCategory(idProduct, idCategory) {
        await ProductService.attachProductCategory(idProduct, idCategory);
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

        await ProductService.addProductTags(idProduct, [tag.id_tag]);

        return tag;
    }

    static async createProductCategory(idProduct, categoryLabel) {
        const categoryModel = new CategoryModel();

        const slug = toSlug(categoryLabel);

        let category = await categoryModel.findBySlug(slug);
        if (!category) {
            category = await categoryModel.create({ label: categoryLabel });
        }

        await ProductService.attachProductCategory(
            idProduct,
            category.id_category
        );

        return category;
    }

    static async updateProductDetails(idProduct, detailItems) {
        if (!Array.isArray(detailItems)) {
            return res
                .status(400)
                .json({ message: "Product items should be an array" });
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
            return res.status(400).json({
                message:
                    "Malformed product item data. Must have label and description keys",
            });
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

        if (product.status === "active" && prev.status !== product.status) {
            ProductService.launchNextBatch(product);
        }

        return product;
    }

    static async launchNextBatch(product) {
        console.log("TODO: Launch launch!", product);
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

        rows.forEach((row) => ProductService.applyProductCategories(row));

        return {
            limit,
            page,
            rows,
            total,
            pages: Math.ceil(total / limit),
        };
    }

    static async applyProductImages(product) {
        product.images = (
            await ProductService.getProductImages(product.id_product)
        ).map((image) => {
            return { ...image, path: "/uploads/" + image.path };
        });
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

        ProductService.applyProductCategories(product);
        ProductService.applyProductTags(product);
        await ProductService.applyProductImages(product);

        return product;
    }
}
