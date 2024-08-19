import BaseController from "./_.controller.js";

import UserController from "./api/user.controller.js";
import AdminController from "./api/admin.controller.js";

import notFound from "../middleware/notFound.middleware.js";

class ApiController extends BaseController {
    base = "/api";

    constructor() {
        super();
    }

    initRoutes() {
        this.registerControllers([new UserController(), new AdminController()]);

        this.router.get("/test", (req, res) => {
            res.send({ page: "api test" });
        });

        this.router.use(
            notFound((res) => {
                res.send({ message: "Api route not found" });
            })
        );
    }
}

export default ApiController;
