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

export default class UserService {
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
     * @param {{ winningOnly: boolean; page: number; limit: number; }} config
     */
    static async getPaginatedUserBids(user, config = {}) {
        const { winningOnly = false, page = 1, limit = 20 } = config;

        const prisma = getPrisma();

        let baseQuery = `SELECT * FROM Bid WHERE id_user = ${Number(user.id)} `;

        if (winningOnly) {
            baseQuery = `
            SELECT a.* 
            FROM Bid a 
            JOIN (
                SELECT MAX(id_bid) AS id_bid, id_item
                FROM Bid 
                GROUP BY id_item 
            ) b ON a.id_bid = b.id_bid
            JOIN (
                SELECT * FROM ProductItem 
                WHERE (status = 'active' OR status = 'claimed' OR status = 'purchased')
            ) i ON a.id_item = i.id_item
            WHERE a.id_user = ${Number(user.id)} `;
        }

        let query = baseQuery;

        query += `ORDER BY id_bid DESC `;

        query += `LIMIT ${page * limit - limit}, ${limit}`;

        const countQuery = baseQuery.replace(
            `SELECT a.*`,
            "SELECT COUNT(*) AS total"
        );

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
