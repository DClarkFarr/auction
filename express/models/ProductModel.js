import UserError from "../errors/UserError.js";
import { getPrisma } from "../prisma/client.js";
import { toSlug } from "../utils/slug.js";

/**
 * @typedef {import("@prisma/client").Product} ProductDocument
 * @typedef {import("@prisma/client").PrismaClient["product"]} ProductTable
 */

/**
 *
 */
class ProductModel {
    /**
     * @type {ProductTable}
     */
    table = null;

    constructor() {
        this.table = getPrisma().product;
    }

    findBySlug(slug) {
        return this.table.findFirst({
            where: {
                slug,
            },
        });
    }

    /**
     * @param {ProductDocument} doc
     */
    async create(doc) {
        const slug = toSlug(doc.name);

        const existing = this.findBySlug(slug);

        if (existing) {
            throw new UserError("Product w/ slug already exists");
        }

        const created = await this.table.create({
            data: {
                ...doc,
                slug,
            },
        });

        if (!created) {
            throw new UserError("Product creation failed lookup");
        }

        return created;
    }

    /**
     *
     * @param {string} id
     * @param {ProductDocument} toSet
     */
    async update(id, toSet) {
        let slug = toSet.name ? toSlug(toSet.name) : undefined;

        if (slug) {
            toSet.slug = slug;

            const conflicted = await this.table.findFirst({
                where: {
                    slug,
                    id_product: {
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
            where: { id_product: id },
            data: toSet,
        });

        return updated;
    }

    /**
     * @param {ProductDocument} doc
     */
    toObject(doc) {
        const obj = { ...doc };

        return obj;
    }
}

export default ProductModel;
