import BaseController from "../_.controller.js";
import StripeService from "../../services/StripeService.js";
import webSessionMiddleware from "../../middleware/webSessionMiddleware.js";
import { hasUser } from "../../middleware/auth.middleware.js";

export default class StripeController extends BaseController {
    base = "/stripe";

    constructor() {
        super();
    }
    initRoutes() {
        const middleware = [webSessionMiddleware, hasUser()];

        this.router.get("/customer", middleware, this.route(this.getCustomer));

        this.router.post(
            "/setup-intent",
            middleware,
            this.route(this.createSetupIntent)
        );
    }

    async createSetupIntent(req, res) {
        try {
            const setupIntent = await StripeService.createSetupIntent(req.user);

            return res.json(setupIntent);
        } catch (err) {
            console.warn("error getting stripe customer", err);
            res.status(400).json({ message: "Error creating setup intent" });
        }
    }

    async getCustomer(req, res) {
        try {
            const customer = await StripeService.findOrCreateCustomer(req.user);

            return res.json({ id_external: customer.id });
        } catch (err) {
            console.warn("error getting stripe customer", err);
            res.status(400).json({ message: "Failed to get stripe customer " });
        }
    }
}
