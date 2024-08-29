import { pick } from "lodash-es";
import { hasAccessLevel, hasUser } from "../../middleware/auth.middleware.js";
import webSessionMiddleware from "../../middleware/webSessionMiddleware.js";
import AdminService from "../../services/AdminService.js";
import BaseController from "../_.controller.js";
import ProductService from "../../services/ProductService.js";
import CategoryService from "../../services/CategoryService.js";
import SiteService from "../../services/SiteService.js";

export default class SiteController extends BaseController {
    base = "/site";

    constructor() {
        super();
    }
    initRoutes() {
        this.router.get("/categories", this.route(this.getCategories));

        this.router.get("/tags", this.route(this.getTags));

        this.router.get("/setting/:key", this.route(this.getSetting));
        this.router.get("/settings", this.route(this.getSettings));
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
            console.warn("caught error getting site setting", err.message);
            res.status(400).json({ message: err.message });
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
            console.warn("caught error getting site setting", err.message);
            res.status(400).json({ message: err.message });
        }
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
