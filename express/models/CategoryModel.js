import UserError from "../errors/UserError.js";
import { getPrisma } from "../prisma/client.js";
import { toSlug } from "../utils/slug.js";

/**
 * @typedef {import("@prisma/client").Category} CategoryDocument
 * @typedef {import("@prisma/client").PrismaClient["category"]} CategoryTable
 */

/**
 *
 */
class CategoryModel {
    /**
     * @type {CategoryTable}
     */
    table = null;

    constructor() {
        this.table = getPrisma().category;
    }

    findBySlug(slug) {
        return this.table.findFirst({
            where: {
                slug,
            },
        });
    }

    /**
     * @param {CategoryDocument} doc
     */
    async create(doc) {
        const slug = toSlug(doc.label);

        const existing = this.findBySlug(slug);

        if (existing) {
            throw new UserError("Category w/ slug already exists");
        }

        const created = await this.table.create({
            data: {
                ...doc,
                slug,
            },
        });

        if (!created) {
            throw new UserError("Category creation failed lookup");
        }

        return created;
    }

    /**
     *
     * @param {string} id
     */
    async update(id, toSet) {
        let slug = toSet.label ? toSlug(toSet.label) : undefined;

        if (slug) {
            toSet.slug = slug;

            const conflicted = await this.table.findFirst({
                where: {
                    slug,
                    id_category: {
                        not: id,
                    },
                },
            });

            if (conflicted) {
                throw new UserError(
                    "Product name conflicted with existing product"
                );
            }
        }

        const updated = await this.table.update({
            where: { id_category: id },
            data: toSet,
        });

        return updated;
    }

    /**
     * @param {CategoryDocument} doc
     */
    toObject(doc) {
        const obj = { ...doc };

        return obj;
    }
}

export default CategoryModel;
