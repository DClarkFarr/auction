import { hasAccessLevel, hasUser } from "../../middleware/auth.middleware.js";
import webSessionMiddleware from "../../middleware/webSessionMiddleware.js";
import AdminService from "../../services/AdminService.js";
import BaseController from "../_.controller.js";

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
    }

    async queryProduct(req, res) {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res
                .status(400)
                .json({ message: "Invalid product id given" });
        }

        try {
            const product = await AdminService.getProductById(id);

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
            const results = await AdminService.getPaginatedProducts({
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
            const product = await AdminService.createProduct({ name });

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
