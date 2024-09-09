/**
 * @typedef {import("../models/UserModel").UserDocument} UserDocument
 * @typedef {import("../models/FavoriteModel").FavoriteDocument} FavoriteDocument
 * @typedef {import("../models/BidModel.js").BidDocument} BidDocument
 */

import FavoriteModel from "../models/FavoriteModel.js";
import BidModel from "../models/BidModel.js";
import { getPrisma } from "../prisma/client.js";

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
            WHERE id_user = ${Number(user.id)} `;
        }

        let query = baseQuery;

        query += `ORDER BY id_bid DESC `;

        query += `LIMIT ${page * limit - limit}, ${limit}`;

        const countQuery = baseQuery.replace(
            `SELECT *`,
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
}
