import UserError from "../errors/UserError.js";
import { getPrisma } from "../prisma/client.js";
import { toSlug } from "../utils/slug.js";

/**
 * @typedef {import("@prisma/client").Image} ImageDocument
 * @typedef {import("@prisma/client").PrismaClient["image"]} ImageTable
 */

/**
 *
 */
class ImageModel {
    /**
     * @type {ImageTable}
     */
    table = null;

    constructor() {
        this.table = getPrisma().image;
    }

    /**
     *
     * @param {ImageDocument['resourceType']} resourceType
     * @param {ImageDocument['resourceId']} resourceId
     * @returns
     */
    findByResource(resourceType, resourceId) {
        return this.table.findMany({
            where: {
                resourceId,
                resourceType,
            },
        });
    }

    /**
     * @param {ImageDocument} doc
     */
    async create(doc) {
        if (existing) {
            throw new UserError("Image w/ slug already exists");
        }

        const created = await this.table.create({
            data: {
                ...doc,
            },
        });

        if (!created) {
            throw new UserError("Image creation failed lookup");
        }

        return created;
    }

    /**
     *
     * @param {string} id
     */
    async update(id, toSet) {
        const updated = await this.table.update({
            where: { id_image: id },
            data: toSet,
        });

        return updated;
    }

    /**
     * @param {ImageDocument} doc
     */
    toObject(doc) {
        const obj = { ...doc };

        return obj;
    }
}

export default ImageModel;
