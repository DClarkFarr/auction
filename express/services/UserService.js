/**
 * @typedef {import("../models/UserModel").UserDocument} UserDocument
 * @typedef {import("../models/FavoriteModel").FavoriteDocument} FavoriteDocument
 */

import FavoriteModel from "../models/FavoriteModel.js";

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
        return favoriteModel.upsertByItemId(user.id, item_id);
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
}
