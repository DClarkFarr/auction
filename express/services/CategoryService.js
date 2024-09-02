import { keyBy } from "lodash-es";
import CategoryModel from "../models/CategoryModel.js";
import TagModel from "../models/TagModel.js";
import ImageModel from "../models/ImageModel.js";
import SiteService from "./SiteService.js";
import { getPrisma } from "../prisma/client.js";
import { Prisma } from "@prisma/client";

/**
 * @typedef {import("../models/CategoryModel.js").CategoryDocument} CategoryDocument
 */
export default class CategoryService {
    static async getFeaturedCategories() {
        const categoryModel = new CategoryModel();
        const imageModel = new ImageModel();
        const setting = await SiteService.getSetting("featuredCategories");

        const { value: featuredCategories } = setting || {};

        const populatedWithCategories = await Promise.all(
            (featuredCategories || []).map(async (fc) => {
                if (fc.id_category) {
                    const category = await categoryModel.table.findFirst({
                        where: {
                            id_category: fc.id_category,
                        },
                    });

                    if (category) {
                        fc.category = category;
                        fc.name = fc.name || c.label;
                        const [image] =
                            (await imageModel.findByResource(
                                "category",
                                category.id
                            )) || [];

                        if (image) {
                            fc.image = fc.image || image.path;
                            category.image = image;
                        }
                    }
                }

                return fc;
            })
        );

        return populatedWithCategories.filter((pc) => !!pc.category);
    }

    /**
     *
     * @param {CategoryDocument[]} categories
     */
    static async applyProductCountToCategories(categories) {
        const categoryIds = categories.map((c) => c.id_category);
        const prisma = getPrisma();

        const rows = (
            await prisma.$queryRaw`SELECT pc.categoryId as id_category, COUNT(*) AS total 
                FROM ProductCategories pc 
                JOIN ProductItem pi ON pi.id_product = pc.productId 
                WHERE pi.status = 'active'
                AND pi.expiresAt > DATE_SUB(NOW(), INTERVAL 6 HOUR)
                AND pc.categoryId IN(${Prisma.join(categoryIds)})
                GROUP BY pc.categoryId
            `
        ).map(({ id_category, total }) => ({
            id_category,
            total: Number(total),
        }));

        const keyedCounts = keyBy(rows, "id_category");

        return categories.map((c) => {
            c.productCount = keyedCounts[c.id_category]?.total || 0;
            return c;
        });
    }
    static async deleteCategoryImage(idCategory) {
        const categoryModel = new CategoryModel();
        const imageModel = new ImageModel();

        const category = await categoryModel.table.findFirst({
            where: {
                id_category: idCategory,
            },
        });

        if (!category) {
            throw new Error("Category not found");
        }

        await imageModel.table.deleteMany({
            where: {
                resourceType: "category",
                resourceId: category.id_category,
            },
        });

        category.image = null;

        return category;
    }
    static async getCategories({
        categoryIds,
        slugs,
        withImages = false,
        withProductCount = false,
    }) {
        const categoryModel = new CategoryModel();

        let categories = await categoryModel.table.findMany({
            orderBy: {
                label: "asc",
            },
            where: {
                categoryIds: categoryIds?.length
                    ? {
                          in: categoryIds,
                      }
                    : undefined,
                slug: slugs?.length
                    ? {
                          in: slugs,
                      }
                    : undefined,
            },
        });

        if (!withImages && categories.length) {
            categories = await this.applyImageToCategories(categories);
        }

        if (withProductCount && categories.length) {
            categories = await this.applyProductCountToCategories(categories);
        }

        return categories;
    }

    /**
     * @param {number} id
     * @param {CategoryDocument} toSet
     */
    static async updateCategory(id, toSet) {
        const categoryModel = new CategoryModel();

        const category = await categoryModel.update(id, toSet);

        await this.applyImageToCategory(category);

        return category;
    }

    static async getTags() {
        const tagModel = new TagModel();

        return tagModel.table.findMany({
            orderBy: {
                label: "asc",
            },
        });
    }

    /**
     *
     * @param {CategoryDocument[]} categories
     */
    static async applyImageToCategories(categories) {
        /**
         * @type {Record<number, CategoryDocument & {image: object | null}>}
         */
        const keyed = keyBy(
            categories.map((c) => ({ ...c, image: null })),
            (c) => c.id_category
        );
        const categoryIds = categories.map((c) => c.id_category);

        const imageModel = new ImageModel();

        const images = await imageModel.table.findMany({
            where: {
                resourceType: "category",
                resourceId: {
                    in: categoryIds,
                },
            },
        });

        images.forEach((image) => {
            if (!keyed[image.resourceId]) {
                return;
            }
            keyed[image.resourceId].image = image;
        });

        return Object.values(keyed).sort((a, b) =>
            a.label.localeCompare(b.label)
        );
    }

    static async applyImageToCategory(category) {
        const imageModel = new ImageModel();

        const image = await imageModel.findByResource(
            "category",
            category.id_category
        );

        category.image = image || null;

        return category;
    }

    static async getPaginatedCategories({ page, limit, withImage } = {}) {
        const categoryModel = new CategoryModel();
        const total = await categoryModel.table.count();

        let rows = await categoryModel.table.findMany({
            orderBy: { label: "asc" },
            take: limit,
            skip: page * limit - limit,
        });

        if (withImage) {
            rows = await this.applyImageToCategories(rows);
        }

        return {
            limit,
            page,
            rows,
            total,
            pages: Math.ceil(total / limit),
        };
    }
}
