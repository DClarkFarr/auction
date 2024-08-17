import { DateTime } from "luxon";
import bcrypt from "bcryptjs";

import UserError from "../errors/UserError.js";
import { getPrisma } from "../prisma/client.js";

const hashPassword = (val) => bcrypt.hashSync(val, 10);
const validatePassword = async (text, hash) =>
    bcrypt.compareSync(text, hash) ? true : false;

/**
 * @typedef {import("@prisma/client").User} UserDocument
 * @typedef {import("@prisma/client").PrismaClient["user"]} UserTable
 */

/**
 *
 */
class UserModel {
    /**
     * @type {UserTable}
     */
    table = null;

    constructor() {
        this.table = getPrisma().user;
    }
    /**
     * @param {string} email
     */
    findByEmail(email) {
        return this.table.findUnique({ where: { email } });
    }

    /**
     * @param {UserDocument} user
     * @param {string} password
     */
    validateUserPassword(user, password) {
        return validatePassword(password, user.password);
    }

    /**
     * @param {string} password
     */
    hashPassword(password) {
        return hashPassword(password);
    }

    /**
     * @param {{name: string, email: string, password: string, role?: string}} doc
     */
    async create(doc) {
        const existing = await this.findByEmail(doc.email);

        if (existing) {
            throw new UserError("User already exists");
        }

        const created = await this.table.create({
            data: {
                ...doc,
                password: this.hashPassword(doc.password),
            },
        });

        if (!created) {
            throw new UserError("User creation failed lookup");
        }

        return created;
    }

    /**
     *
     * @param {string} id
     */
    async update(id, toSet) {
        const updated = await this.table.update({
            where: { id },
            data: toSet,
        });

        return updated;
    }

    /**
     * @param {UserDocument} user
     */
    toObject(user) {
        const obj = { ...user };
        delete obj.password;

        return obj;
    }
}

export default UserModel;
