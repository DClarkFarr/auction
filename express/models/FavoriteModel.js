import UserError from "../errors/UserError.js";
import { getPrisma } from "../prisma/client.js";

/**
 * @typedef {import("@prisma/client").Favorite} FavoriteDocument
 * @typedef {import("@prisma/client").PrismaClient["favorite"]} FavoriteTable
 */

/**
 *
 */
class FavoriteModel {
    /**
     * @type {FavoriteTable}
     */
    table = null;

    constructor() {
        this.table = getPrisma().favorite;
    }

    /**
     * @param {FavoriteDocument} doc
     */
    async create(doc) {
        const created = await this.table.create({
            data: {
                ...doc,
                status: doc.status || "inactive",
            },
        });

        if (!created) {
            throw new UserError("Favorite creation failed lookup");
        }

        return created;
    }

    /**
     *
     * @param {string} id
     * @param {FavoriteDocument} toSet
     */
    async update(id, toSet) {
        const updated = await this.table.update({
            where: { id_favorite: id },
            data: toSet,
        });

        return updated;
    }

    /**
     *
     * @param {number} id_user
     * @param {number} id_item
     */
    async upsertByItemId(id_user, id_item) {
        const updated = await this.table.upsert({
            where: { id_user, id_item },
            data: { id_item, id_user },
        });

        return updated;
    }

    /**
     * @param {FavoriteDocument} doc
     */
    toObject(doc) {
        const obj = { ...doc };

        return obj;
    }
}

export default FavoriteModel;
