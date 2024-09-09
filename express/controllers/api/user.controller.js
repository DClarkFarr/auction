import BaseController from "../_.controller.js";
import validator from "validator";

import webSessionMiddleware from "../../middleware/webSessionMiddleware.js";
import { hasUser } from "../../middleware/auth.middleware.js";

import UserError from "../../errors/UserError.js";
import UserModel from "../../models/UserModel.js";
import { hasRecaptcha } from "../../middleware/recaptcha.middleware.js";
import StripeService from "../../services/StripeService.js";
import { validatePassword } from "../../utils/validators.js";
import UserService from "../../services/UserService.js";
import ProductService from "../../services/ProductService.js";
import { pick } from "lodash-es";

class UserController extends BaseController {
    base = "/user";

    constructor() {
        super();
    }
    initRoutes() {
        this.router.post(
            "/login",
            // webSessionMiddleware.optional,
            this.route(this.userLogin)
        );
        this.router.post(
            "/logout",
            webSessionMiddleware,
            hasUser(),
            this.route(this.userLogout)
        );
        this.router.post(
            "/register",
            webSessionMiddleware.optional,
            hasRecaptcha((req) => req.body.token),
            this.route(this.userRegister)
        );

        this.router.post(
            "/:id/password",
            webSessionMiddleware,
            hasUser(),
            this.route(this.changeUserPassword)
        );

        this.router.get(
            "/favorites",
            webSessionMiddleware,
            hasUser(),
            this.route(this.getFavorites)
        );
        this.router.post(
            "/favorites",
            webSessionMiddleware,
            hasUser(),
            this.route(this.addFavorite)
        );
        this.router.delete(
            "/favorites",
            webSessionMiddleware,
            hasUser(),
            this.route(this.removeFavorite)
        );

        this.router.get(
            "/bids/items",
            webSessionMiddleware,
            hasUser(),
            this.route(this.getUserBidProducts)
        );

        this.router.get(
            "/bids",
            webSessionMiddleware,
            hasUser(),
            this.route(this.getUserBids)
        );

        this.router.get(
            "/favorites/items",
            webSessionMiddleware,
            hasUser(),
            this.route(this.getUserFavoriteItems)
        );

        this.router.post(
            "/checkout/items",
            webSessionMiddleware,
            hasUser(),
            this.route(this.checkoutItems)
        );

        this.router.get("/test", (req, res) => {
            res.json({ message: "test" });
        });

        this.router.get(
            "/",
            webSessionMiddleware,
            hasUser(),
            this.route(this.getUser)
        );
    }

    async getUserBids(req, res) {
        const user = req.user;

        try {
            const bids = await UserService.getUserBids(user);
            res.json(bids);
        } catch (err) {
            console.warn("Caught error getting user bids", err);
            res.status(400).json({ message: "Error getting user bids" });
        }
    }

    async getUserBidProducts(req, res) {
        const user = req.user;

        const params = pick(req.query, [
            // standard product pagination
            "sortBy",
            "categoryIds",
            "page",
            "limit",
            "quality",
            "priceMin",
            "priceMax",
            "productIds",

            // bid query params
            "winning",
        ]);

        try {
            const paginatedBids = await UserService.getPaginatedUserBids(user, {
                page: params.page,
                limit: params.limit,
                winningOnly: params.winning === "true",
            });

            const itemIds = paginatedBids.rows.map((b) => b.id_item);

            const results = await ProductService.getPaginatedProductItems(
                {
                    ...params,
                    itemIds,
                },
                false
            );

            res.json(results);
        } catch (err) {
            console.warn("Error getting user bids", err);
            res.status(400).json({ message: "Error getting user bids" });
        }
    }

    async getUserFavoriteItems(req, res) {
        const user = req.user;

        const params = pick(req.query, [
            "sortBy",
            "categoryIds",
            "page",
            "limit",
            "quality",
            "priceMin",
            "priceMax",
            "productIds",
        ]);

        try {
            const favorites = await UserService.getFavorites(user);

            const itemIds = favorites.map((f) => f.id_item);

            const results = await ProductService.getPaginatedProductItems(
                {
                    ...params,
                    itemIds,
                },
                false
            );

            res.json(results);
        } catch (err) {
            console.warn("Error getting user bids", err);
            res.status(400).json({ message: "Error getting user bids" });
        }
    }

    async getFavorites(req, res) {
        const user = req.user;
        try {
            const favorites = await UserService.getFavorites(user);
            res.json(favorites);
        } catch (err) {
            console.warn("Caught error getting favorites", err);
            res.status(400).json({ message: "Error getting user favorites" });
        }
    }

    async addFavorite(req, res) {
        const user = req.user;
        const id_item = Number(req.body.id_item);

        if (isNaN(id_item)) {
            return res.status(400).json({ message: "Invalid item id" });
        }
        try {
            const favorite = await UserService.addFavorite(user, id_item);
            res.json(favorite);
        } catch (err) {
            console.warn("Error adding favorite", err);
            res.status(400).json({ message: "Error adding favorite" });
        }
    }

    async removeFavorite(req, res) {
        const user = req.user;
        const id_item = Number(req.body.id_item);

        if (isNaN(id_item)) {
            return res.status(400).json({ message: "Invalid item id" });
        }

        try {
            await UserService.removeFavorite(user, id_item);
            res.json({ message: "Favorite removed " });
        } catch (err) {
            console.warn("Error removing favorite", err);
            res.status(400).json({ message: "Error removing favorite" });
        }
    }

    async changeUserPassword(req, res) {
        const userModel = new UserModel();

        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;

            const user = await userModel.table.findFirst({
                where: {
                    id: req.user.id,
                },
            });

            if (!(await userModel.validateUserPassword(user, oldPassword))) {
                return res
                    .status(400)
                    .json({ message: "Current password was invalid" });
            }

            if (!validatePassword(newPassword)) {
                return res.status(400).json({
                    message: "New password doesn't match requirements",
                });
            }

            if (newPassword !== confirmPassword) {
                return res
                    .status(400)
                    .json({ message: "New passwords don't match." });
            }

            await userModel.update(user.id, {
                password: userModel.hashPassword(newPassword),
            });

            res.json({ message: "Password updated" });
        } catch (err) {
            console.warn("caught error changing user password", err);
            res.status(400).json({ message: "Error updating user's password" });
        }
    }

    async getUser(req, res) {
        try {
            const user = req.user;

            let paymentMethod = null;
            try {
                paymentMethod = await StripeService.getUserDefaultPaymentMethod(
                    user
                );
            } catch (err) {
                console.warn(
                    "getting user -> could not connect to stripe",
                    err
                );
            }

            res.json({ user, paymentMethod });
        } catch (err) {
            console.warn("Error getting session user", err);
            res.status(400).json({ message: "Error getting session user" });
        }
    }

    async userLogout(req, res) {
        req.session.destroy();
        res.json({
            status: "success",
            message: "You've been successfully logged out",
        });
    }

    async userLogin(req, res) {
        const session = req.session;

        if (!req.body.email) {
            return res.status(401).json({
                message: "Email is required",
            });
        }
        if (!req.body.password) {
            return res.status(401).json({
                message: "Password is required",
            });
        }

        const userModel = new UserModel();

        const user = await userModel.findByEmail(req.body.email);

        if (!user) {
            return res.status(404).json({
                message: "Email not found",
            });
        }

        if (!(await userModel.validateUserPassword(user, req.body.password))) {
            return res.status(401).json({
                message: "Email/password did not match our records",
            });
        }

        try {
            session.user = userModel.toObject(user);

            let paymentMethod = null;
            try {
                paymentMethod = await StripeService.getUserDefaultPaymentMethod(
                    user
                );
            } catch (err) {
                console.warn("Could not connect to stripe", err);
            }

            res.json({
                user: userModel.toObject(user),
                paymentMethod,
                status: "success",
                message: "You've been successfully logged in",
            });
        } catch (err) {
            console.warn("Error logging user in: ", err.message);
            res.status(400).json({ message: "Error logging user in" });
        }
    }

    async userRegister(req, res) {
        const session = req.session;
        const userModel = new UserModel();

        if (!req.body.email || !validator.isEmail(req.body.email)) {
            return res.status(401).json({
                message: "Email is required",
            });
        }
        if (!req.body.password || req.body.password?.length < 6) {
            return res.status(401).json({
                message: "Password is required",
            });
        }
        if (!req.body.name || req.body.name?.length < 2) {
            return res.status(401).json({
                message: "Name is required",
            });
        }

        try {
            const user = await userModel.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });

            session.user = userModel.toObject(user);

            res.json({
                user: userModel.toObject(user),
                status: "success",
                message: "You've been successfully logged in",
            });
        } catch (err) {
            if (err instanceof UserError) {
                return res.status(401).json({
                    message: err.message,
                });
            }

            console.warn("Caught error creating user", err);

            return res.status(500).json({
                message: "An unknown error occurred creating user",
            });
        }
    }

    async checkoutItems(req, res) {
        const user = req.user;

        if (!Array.isArray(req.body.itemIds)) {
            return res
                .status(400)
                .json({ message: "Item ids required for checkout" });
        }

        const itemIds = req.body.itemIds.map(Number).filter((n) => !isNaN(n));

        if (!itemIds.length || itemIds.length !== req.body.itemIds.length) {
            return res.status(400).json({ message: "Invalid item ids given" });
        }

        try {
            const result = await UserService.checkoutItems(user, itemIds);
            res.json(result);
        } catch (err) {
            console.error("Error checking out", err);
            if (err instanceof UserError) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(400).json({
                    message:
                        "An unknown error ocurred. Please try again or contact support.",
                });
            }
        }
    }
}

export default UserController;
