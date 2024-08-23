import { pick } from "lodash-es";
import { hasAccessLevel, hasUser } from "../../middleware/auth.middleware.js";
import webSessionMiddleware from "../../middleware/webSessionMiddleware.js";
import AdminService from "../../services/AdminService.js";
import BaseController from "../_.controller.js";
import ProductService from "../../services/ProductService.js";

export default class AdminController extends BaseController {
    base = "/admin";

    constructor() {
        super();
    }
    initRoutes() {
        const middleware = [
            webSessionMiddleware,
            hasUser(),
            hasAccessLevel("admin"),
        ];
        this.router.get("/users", middleware, this.route(this.getUsers));

        this.router.post(
            "/products",
            middleware,
            this.route(this.createProduct)
        );

        this.router.get(
            "/products",
            middleware,
            this.route(this.queryProducts)
        );

        this.router.get(
            "/products/:id",
            middleware,
            this.route(this.queryProduct)
        );

        this.router.put(
            "/products/:id",
            middleware,
            this.route(this.updateProduct)
        );

        this.router.post(
            "/products/:id/items",
            middleware,
            this.route(this.updateDetailItems)
        );
    }

    async updateDetailItems(req, res) {
        const id = Number(req.params.id);
        const items = req.body.items || [];

        try {
            await ProductService.updateProductDetails(id, items);

            const product = await ProductService.getProductById(id);

            res.json(product);
        } catch (err) {
            console.warn("Caught error saving product items", err);
            res.status(400).json({ message: err.message });
        }
    }

    async updateProduct(req, res) {
        const id = Number(req.params.id);

        const toSet = pick(req.body, [
            "auctionBatchCount",
            "description",
            "initialQuantity",
            "name",
            "priceCost",
            "priceInitial",
            "priceRetail",
            "quality",
            "remainingQuantity",
            "scheduledFor",
            "sku",
            "status",
        ]);

        try {
            await ProductService.updateProduct(id, toSet);

            const product = await ProductService.getProductById(id);

            res.json(product);
        } catch (err) {
            console.warn("error updating product", err);

            res.status(400).json({ message: err.message });
        }
    }

    async queryProduct(req, res) {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res
                .status(400)
                .json({ message: "Invalid product id given" });
        }

        try {
            const product = await ProductService.getProductById(id);

            res.json(product);
        } catch (err) {
            console.warn("error saving product", err);
            res.status(401).json({ message: err.message });
        }
    }

    async queryProducts(req, res) {
        const status = Array.isArray(req.query.status) ? req.query.status : [];
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;

        try {
            const results = await ProductService.getPaginatedProducts({
                status,
                page,
                limit,
                withCategories: true,
            });

            res.json(results);
        } catch (err) {
            res.status(401).json({
                message: "Error loading products",
                error: err.message,
            });
        }
    }

    async createProduct(req, res) {
        const name = req.body.name?.trim() || "";

        if (name.length < 3) {
            return res.status(401).json({ message: "Name required" });
        }

        try {
            const product = await ProductService.createProduct({ name });

            res.json(product);
        } catch (err) {
            res.status(401).json({ message: err.message });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await AdminService.getUsers();

            res.json(users);
        } catch (err) {
            return res.status(401).json({ message: err.message });
        }
    }
}
