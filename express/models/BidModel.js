import UserError from "../errors/UserError.js";
import { getPrisma } from "../prisma/client.js";

/**
 * @typedef {import("@prisma/client").Bid} BidDocument
 * @typedef {import("@prisma/client").PrismaClient["bid"]} BidTable
 */

/**
 *
 */
class BidModel {
    /**
     * @type {BidTable}
     */
    table = null;

    constructor() {
        this.table = getPrisma().bid;
    }

    /**
     * @param {BidDocument} doc
     */
    async create(doc) {
        const created = await this.table.create({
            data: {
                ...doc,
                status: doc.status || "inactive",
            },
        });

        if (!created) {
            throw new UserError("Bid creation failed lookup");
        }

        return created;
    }

    /**
     *
     * @param {string} id
     * @param {BidDocument} toSet
     */
    async update(id, toSet) {
        const updated = await this.table.update({
            where: { id_bid: id },
            data: toSet,
        });

        return updated;
    }

    /**
     * @param {BidDocument} doc
     */
    toObject(doc) {
        const obj = { ...doc };

        return obj;
    }
}

export default BidModel;
