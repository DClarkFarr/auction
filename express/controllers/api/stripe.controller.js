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

        this.router.post(
            "/payment-method",
            middleware,
            this.route(this.savePaymentMethod)
        );
    }

    async savePaymentMethod(req, res) {
        const paymentMethod = req.body.paymentMethod;
        if (!paymentMethod || typeof paymentMethod !== "string") {
            return res.status(400).json({ message: "Payment method required" });
        }
        try {
            const pm = await StripeService.savePaymentMethod(
                req.user,
                paymentMethod
            );
            res.json(pm);
        } catch (err) {
            console.warn("Error saving payment method", err);
            res.status(400).json({ message: "Error saving payment method" });
        }
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
