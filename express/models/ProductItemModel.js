import UserError from "../errors/UserError.js";
import { getPrisma } from "../prisma/client.js";

/**
 * @typedef {import("@prisma/client").ProductItem} ProductItemDocument
 * @typedef {import("@prisma/client").PrismaClient["productItem"]} ProductItemTable
 */

/**
 *
 */
class ProductItemModel {
    /**
     * @type {ProductItemTable}
     */
    table = null;

    constructor() {
        this.table = getPrisma().productItem;
    }

    /**
     * @param {ProductItemDocument} doc
     */
    async create(doc) {
        const created = await this.table.create({
            data: {
                ...doc,
                status: doc.status || "inactive",
            },
        });

        if (!created) {
            throw new UserError("Product Item creation failed lookup");
        }

        return created;
    }

    /**
     *
     * @param {string} id
     * @param {ProductItemDocument} toSet
     */
    async update(id, toSet) {
        const updated = await this.table.update({
            where: { id_product: id },
            data: toSet,
        });

        return updated;
    }

    /**
     * @param {ProductItemDocument} doc
     */
    toObject(doc) {
        const obj = { ...doc };

        return obj;
    }
}

export default ProductItemModel;
