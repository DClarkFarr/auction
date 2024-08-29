import UserError from "../errors/UserError.js";
import { getPrisma } from "../prisma/client.js";
import { toSlug } from "../utils/slug.js";

/**
 * @typedef {import("@prisma/client").SiteSettings} SiteSettingsDocument
 * @typedef {import("@prisma/client").PrismaClient["siteSettings"]} SiteSettingsTable
 */

/**
 *
 */
class SiteSettingsModel {
    /**
     * @type {SiteSettingsTable}
     */
    table = null;

    constructor() {
        this.table = getPrisma().siteSettings;
    }

    findByKey(key) {
        return this.table.findFirst({
            where: {
                key,
            },
        });
    }

    async findByKeys(keys) {
        return await Promise.all(keys.map((key) => this.findByKey(key)));
    }

    /**
     * @param {SiteSettingsDocument} doc
     */
    async create(doc) {
        const slug = toSlug(doc.label);

        const existing = await this.findBySlug(slug);

        if (existing) {
            throw new UserError("SiteSettings w/ slug already exists");
        }

        const created = await this.table.create({
            data: {
                ...doc,
                slug,
            },
        });

        if (!created) {
            throw new UserError("SiteSettings creation failed lookup");
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
                    id_site: {
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
            where: { id_site: id },
            data: toSet,
        });

        return updated;
    }

    /**
     * @param {SiteSettingsDocument} doc
     */
    toObject(doc) {
        const obj = { ...doc };

        return obj;
    }
}

export default SiteSettingsModel;
