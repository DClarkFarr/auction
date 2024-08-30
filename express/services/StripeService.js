import Stripe from "stripe";
import { env } from "../utils/environment.js";
import { getPrisma } from "../prisma/client.js";

/**
 * @typedef {import("../models/UserModel.js").UserDocument} UserDocument
 * @typedef {import("../models/UserModel.js").StripeUserDocument} StripeUserDocument
 */

/**
 * @type {Stripe}
 */
let _stripe;

export default class StripeService {
    static getStripe() {
        if (_stripe) {
            return _stripe;
        }

        return (_stripe = new Stripe(env("stripe.secret")));
    }

    /**
     * @param {UserDocument} user
     */
    static async getStripeUser(user) {
        const stripeUser = await getPrisma().stripeUser.findFirst({
            where: {
                id_user: user.id_user,
            },
        });

        return stripeUser;
    }

    /**
     * @param {StripeUserDocument} stripeUser
     */
    static async getStripeCustomer(stripeUser) {
        const customer = this.getStripe().customers.retrieve(
            stripeUser.id_external
        );

        return customer;
    }

    /**
     * @param {UserDocument} user
     */
    static async createStripeCustomer(user, stripeUser = null) {
        const stripe = this.getStripe();
        const { lastResponse, ...customer } = await stripe.customers.create({
            email: user.email,
            name: user.name,
            source: user.id_user,
        });

        if (!stripeUser) {
            stripeUser = await this.createStripeUser(user, customer);
        }

        return { customer, stripeUser };
    }

    /**
     * @param {UserDocument} user
     * @param {Stripe.Customer} customer
     */
    static async createStripeUser(user, customer) {
        const stripeUser = await getPrisma().stripeUser.create({
            data: {
                id_user: user.id,
                id_external: customer.id,
            },
        });

        return stripeUser;
    }

    /**
     * @param {UserDocument} user
     */
    static async findOrCreateCustomer(user) {
        let stripeUser = await this.getStripeUser(user);
        if (!stripeUser) {
            let { customer } = await this.createStripeCustomer(user);

            return customer;
        }

        let customer = await this.getStripeCustomer(stripeUser);
        if (!customer) {
            customer = await this.createStripeCustomer(stripeUser);
        }

        return customer;
    }

    /**
     * @param {UserDocument} user
     */
    static async createSetupIntent(user) {
        const customer = await this.findOrCreateCustomer(user);

        const stripe = this.getStripe();

        const setupIntent = await stripe.setupIntents.create({
            use_stripe_sdk: true,
            customer: customer.id,
        });

        return setupIntent;
    }
}
