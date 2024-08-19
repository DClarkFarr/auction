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
