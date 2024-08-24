import { pick } from "lodash-es";
import { hasAccessLevel, hasUser } from "../../middleware/auth.middleware.js";
import webSessionMiddleware from "../../middleware/webSessionMiddleware.js";
import AdminService from "../../services/AdminService.js";
import BaseController from "../_.controller.js";
import ProductService from "../../services/ProductService.js";
import CategoryService from "../../services/CategoryService.js";

export default class SiteController extends BaseController {
    base = "/site";

    constructor() {
        super();
    }
    initRoutes() {
        this.router.get("/categories", this.route(this.getCategories));

        this.router.get("/tags", this.route(this.getTags));
    }

    async getCategories(req, res) {
        try {
            const categories = await CategoryService.getCategories();

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
