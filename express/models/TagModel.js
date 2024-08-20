import UserError from "../errors/UserError.js";
import { getPrisma } from "../prisma/client.js";
import { toSlug } from "../utils/slug.js";

/**
 * @typedef {import("@prisma/client").Tag} TagDocument
 * @typedef {import("@prisma/client").PrismaClient["tag"]} TagTable
 */

/**
 *
 */
class TagModel {
    /**
     * @type {TagTable}
     */
    table = null;

    constructor() {
        this.table = getPrisma().tag;
    }

    findBySlug(slug) {
        return this.table.findFirst({
            where: {
                slug,
            },
        });
    }

    /**
     * @param {TagDocument} doc
     */
    async create(doc) {
        const slug = toSlug(doc.label);
        const existing = this.findBySlug(slug);

        if (existing) {
            throw new UserError("Tag w/ slug already exists");
        }

        const created = await this.table.create({
            data: {
                ...doc,
                slug,
            },
        });

        if (!created) {
            throw new UserError("Tag creation failed lookup");
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
                    id_tag: {
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
            where: { id_tag: id },
            data: toSet,
        });

        return updated;
    }

    /**
     * @param {TagDocument} doc
     */
    toObject(doc) {
        const obj = { ...doc };

        return obj;
    }
}

export default TagModel;
