import BaseController from "./_.controller.js";

import AdminController from "./api/admin.controller.js";
import SiteController from "./api/site.controller.js";
import UserController from "./api/user.controller.js";
import StripeController from "./api/stripe.controller.js";

import notFound from "../middleware/notFound.middleware.js";
import { injectionCheck } from "../middleware/validation.middleware.js";

class ApiController extends BaseController {
    base = "/api";

    constructor() {
        super();
    }

    initRoutes() {
        this.router.use(injectionCheck);

        this.registerControllers([
            new UserController(),
            new AdminController(),
            new SiteController(),
            new StripeController(),
        ]);

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
