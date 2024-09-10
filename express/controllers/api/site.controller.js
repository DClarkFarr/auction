import { pick } from "lodash-es";
import BaseController from "../_.controller.js";
import ProductService from "../../services/ProductService.js";
import CategoryService from "../../services/CategoryService.js";
import SiteService from "../../services/SiteService.js";
import { AxiosError } from "axios";

import webSessionMiddleware from "../../middleware/webSessionMiddleware.js";
import { hasUser } from "../../middleware/auth.middleware.js";
import { getSocket } from "../../utils/socket.js";

export default class SiteController extends BaseController {
    base = "/site";

    constructor() {
        super();
    }
    initRoutes() {
        this.router.get("/categories", this.route(this.getCategories));

        this.router.get(
            "/categories/featured",
            this.route(this.getFeaturedCategories)
        );

        this.router.get("/categories/:slug", this.route(this.getCategory));

        this.router.get(
            "/products/paginated",
            this.route(this.getPaginatedActiveItems)
        );

        this.router.get(
            "/products/featured",
            this.route(this.getFeaturedProducts)
        );

        this.router.post(
            "/products/:id/bid",
            webSessionMiddleware,
            hasUser(),
            this.route(this.placeProductBid)
        );

        this.router.get("/tags", this.route(this.getTags));

        this.router.get("/setting/:key", this.route(this.getSetting));
        this.router.get("/settings", this.route(this.getSettings));
    }

    async getCategory(req, res) {
        const categorySlug = req.params.slug?.trim();
        const withImages = req.query.withImages === "true";
        const withProductCount = req.query.withProductCount === "true";

        if (!categorySlug) {
            return res.status(400).json({ message: "Invalid category slug" });
        }

        try {
            const [category] = await CategoryService.getCategories({
                slugs: [categorySlug],
                withImages,
                withProductCount,
            });

            res.json(category);
        } catch (err) {
            console.warn("error fetching categories", err);
            res.status(400).json({ message: err.message });
        }
    }

    async placeProductBid(req, res) {
        const id_item = Number(req.params.id);
        const amount = Number(req.body.amount);
        const user = req.user;

        if (isNaN(id_item)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        if (isNaN(amount)) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        try {
            const result = await ProductService.placeProductBid(
                user,
                id_item,
                amount
            );

            const socket = getSocket();

            socket.of("/bid").emit("update", result);

            res.json(result);
        } catch (err) {
            if (err instanceof AxiosError) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(400).json({ message: "Error placing bid" });
            }
        }
    }

    async getPaginatedActiveItems(req, res) {
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
            const results = await ProductService.getPaginatedProductItems(
                params
            );

            res.json(results);
        } catch (err) {
            console.warn(
                "caught error getting active paginated products/items",
                err
            );
            res.status(400).json({ message: err.message });
        }
    }

    async getSetting(req, res) {
        const key = req.params.key;
        if (!key) {
            return res.status(400).json({ message: "key not provided" });
        }

        try {
            const setting = await SiteService.getSetting(key);

            res.json(setting);
        } catch (err) {
            console.warn("caught error getting site setting", err);
            res.status(400).json({ message: err.message });
        }
    }

    async getFeaturedProducts(req, res) {
        try {
            const featuredProducts = await ProductService.getFeaturedProducts();

            res.json(featuredProducts);
        } catch (err) {
            console.warn("Error getting featured products", err);
            res.status(400).json({
                message: "Error getting featured products",
            });
        }
    }

    async getFeaturedCategories(req, res) {
        try {
            const featuredCategores =
                await CategoryService.getFeaturedCategories();

            res.json(featuredCategores);
        } catch (err) {
            console.warn("Error getting featured categories", err);
            res.status(400).json({
                message: "Error getting featured categories",
            });
        }
    }

    async getSettings(req, res) {
        const keys = req.query.keys;

        if (!Array.isArray(keys)) {
            return res.status(400).json({ message: "keys not valid" });
        }

        try {
            const settings = await SiteService.getSettings(keys);
            res.json(settings);
        } catch (err) {
            console.warn("caught error getting site setting", err);
            res.status(400).json({ message: err.message });
        }
    }

    async getCategories(req, res) {
        const withImages = req.query.withImages === "true";
        const withProductCount = req.query.withProductCount === "true";
        try {
            const categories = await CategoryService.getCategories({
                withImages,
                withProductCount,
            });

            res.json(categories);
        } catch (err) {
            console.warn("error fetching categories", err);
            res.status(400).json({ message: err.message });
        }
    }

    async getTags(req, res) {
        try {
            const tags = await CategoryService.getTags();

            res.json(tags);
        } catch (err) {
            console.warn("error fetching tags", err);
            res.status(400).json({ message: err.message });
        }
    }
}
