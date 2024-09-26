/**
 * @typedef {import("../models/UserModel").UserDocument} UserDocument
 * @typedef {import("../models/FavoriteModel").FavoriteDocument} FavoriteDocument
 * @typedef {import("../models/BidModel.js").BidDocument} BidDocument
 */

import FavoriteModel from "../models/FavoriteModel.js";
import BidModel from "../models/BidModel.js";
import { getPrisma } from "../prisma/client.js";
import ProductService from "./ProductService.js";
import UserError from "../errors/UserError.js";
import StripeService from "./StripeService.js";
import { random } from "lodash-es";
import { DateTime } from "luxon";
import UserModel from "../models/UserModel.js";

export default class UserService {
    static async resetPassword(user, password) {
        const prisma = getPrisma();
        const userModel = new UserModel();

        const updated = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: userModel.hashPassword(password),
            },
        });

        return updated;
    }
    static async getPasswordResetCode(email, token) {
        const prisma = getPrisma();

        const code = await prisma.userPasswordReset.findFirst({
            where: {
                token,
            },
        });

        if (!code) {
            throw new UserError("Invalid code");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: code.id_user,
            },
        });

        if (!user) {
            throw new UserError("Matching user not found");
        }

        if (user.email !== email) {
            throw new UserError("Email does not match");
        }

        const expiresAt = DateTime.fromJSDate(code.expiresAt);
        const now = DateTime.now();

        if (expiresAt < now) {
            throw new UserError("Code has expired");
        }

        const updated = await prisma.userPasswordReset.update({
            where: {
                id: code.id,
            },
            data: {
                usedAt: now.toJSDate(),
            },
        });

        return { code: updated, user };
    }

    static async generatePasswordResetCode(user) {
        const prisma = getPrisma();

        const getCode = async () => {
            const token = String(random(100000, 999999));

            const exists = await prisma.userPasswordReset.findFirst({
                where: {
                    token,
                    expiresAt: {
                        gte: DateTime.now().minus({ days: 1 }).toJSDate(),
                    },
                },
            });

            if (exists) {
                return null;
            }

            const created = await prisma.userPasswordReset.create({
                data: {
                    token,
                    id_user: user.id,
                    expiresAt: DateTime.now().plus({ minutes: 45 }).toJSDate(),
                },
            });

            return created;
        };

        let code = null;
        let count = 0;
        do {
            count++;
            code = await getCode();
        } while (count < 100 && !code);

        if (!code) {
            throw new Error("Failed to generate code, with count: " + count);
        }

        return code;
    }

    /**
     * @param {UserDocument} user
     */
    static getFavorites(user) {
        const favoriteModel = new FavoriteModel();

        return favoriteModel.table.findMany({
            where: {
                id_user: user.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }

    /**
     * @param {UserDocument} user
     * @param {number} id_item
     */
    static addFavorite(user, id_item) {
        const favoriteModel = new FavoriteModel();
        return favoriteModel.upsertByItemId(user.id, id_item);
    }

    /**
     * @param {UserDocument} user
     * @param {number} id_item
     */
    static removeFavorite(user, id_item) {
        const favoriteModel = new FavoriteModel();
        return favoriteModel.table.deleteMany({
            where: {
                id_user: user.id,
                id_item,
            },
        });
    }

    /**
     *
     * @param {UserDocument} user
     * @returns
     */
    static async getUserBids(user) {
        const bidModel = new BidModel();

        return bidModel.table.findMany({
            where: {
                id_user: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    /**
     * @param {UserDocument} user
     * @param {{ winningOnly: boolean; page: number; limit: number; days?: number, status?: string[] }} config
     */
    static async getPaginatedUserBids(user, config = {}) {
        const {
            winningOnly = false,
            page = 1,
            limit = 20,
            days = null,
            status = ["active", "claimed", "purchased", "rejected", "canceled"],
        } = config;

        const prisma = getPrisma();

        const pieces = {
            select: `SELECT a.* `,
            from: `FROM Bid a `,
            where: `WHERE a.id_user = ${Number(user.id)} `,
            joinMax: `JOIN (
                SELECT MAX(id_bid) AS id_bid, id_item
                FROM Bid 
                WHERE 1 
                ${!winningOnly ? `AND id_user = ${Number(user.id)}` : ""}
                GROUP BY id_item 
            ) b ON a.id_bid = b.id_bid `,
            joinItem: `JOIN (
                SELECT * FROM ProductItem 
                WHERE (status IN(${status.map((s) => `"${s}"`).join(",")}))
            ) i ON a.id_item = i.id_item `,
            order: `ORDER BY id_bid DESC `,
            limit: `LIMIT ${page * limit - limit}, ${limit}`,
        };

        let baseQuery = `${pieces.select} ${pieces.from} ${pieces.joinMax}`;

        if (Array.isArray(status) && status.length) {
            baseQuery += pieces.joinItem;
        }

        baseQuery += pieces.where;

        if (days) {
            baseQuery += `AND a.createdAt > DATE_SUB(NOW(), INTERVAL ${days} DAY) `;
        }

        const countQuery = baseQuery.replace(
            `SELECT a.*`,
            "SELECT COUNT(*) AS total"
        );

        const query = `${baseQuery} ${pieces.order} ${pieces.limit}`;

        const countRow = await prisma.$queryRawUnsafe(countQuery);

        const total = Number(countRow[0].total);

        /**
         * @type {BidDocument[]}
         */

        const rows = await prisma.$queryRawUnsafe(query);

        const final = {
            total,
            rows,
            page,
            pages: Math.ceil(total / limit),
            limit: limit,
        };

        return final;
    }

    /**
     *
     * @param {UserDocument} user
     * @param {number[]} itemIds
     * @returns
     */
    static async checkoutItems(user, itemIds) {
        const items = await ProductService.getPopulatedItemsByIds([...itemIds]);

        // validate items
        const errors = [];
        items.forEach((item) => {
            if (!item.bid) {
                errors.push("ID: " + item.id_item + " had no bid");
            } else if (item.bid.id_user !== user.id) {
                errors.push("ID: " + item.id_item + " did not belong to user");
            } else if (item.rejectedAt || item.id_purchase || item.canceledAt) {
                errors.push(
                    "ID: " + item.id_item + " is no longer valid to purchase"
                );
            }
        });

        if (errors.length) {
            throw new UserError(errors.join("\n"));
        }

        const purchase = await StripeService.chargeUserForItems(user, items);

        return { items, purchase };
    }

    /**
     *
     * @param {UserDocument} user
     */
    static async getPopulatedUserPurchases(user) {
        const purchases = await this.getUserPurchases(user);

        return ProductService.applyPurchasesData(purchases);
    }

    /**
     * @param {UserDocument} user
     */
    static async getUserPurchases(user) {
        const prisma = getPrisma();

        return prisma.purchase.findMany({
            where: {
                id_user: user.id,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    /**
     *
     * @param {UserDocument} user
     * @param {number} id_item
     */
    static async getPopulatedUserPurchase(user, id_item) {
        const prisma = getPrisma();

        const purchase = await prisma.purchase.findUnique({
            where: {
                id_purchase: id_item,
                id_user: user.id,
            },
            include: {
                user: true,
            },
        });

        const list = await ProductService.applyPurchasesData([purchase]);

        return list[0];
    }
}
