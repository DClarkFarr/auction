import { keyBy } from "lodash-es";
import CategoryModel from "../models/CategoryModel.js";
import TagModel from "../models/TagModel.js";
import ImageModel from "../models/ImageModel.js";

/**
 * @typedef {import("../models/CategoryModel.js").CategoryDocument} CategoryDocument
 */
export default class CategoryService {
    static async getCategories() {
        const categoryModel = new CategoryModel();

        return categoryModel.table.findMany({
            orderBy: {
                label: "asc",
            },
        });
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
            keyed[image.resourceId] = image;
        });

        return Object.values(keyed).sort((a, b) =>
            a.label.localeCompare(b.label)
        );
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
