import Stripe from "stripe";
import { env, getEnvHost } from "../utils/environment.js";
import { getPrisma } from "../prisma/client.js";
import UserError from "../errors/UserError.js";

/**
 * @typedef {import("../models/UserModel.js").UserDocument} UserDocument
 * @typedef {import("../models/UserModel.js").StripeUserDocument} StripeUserDocument
 * @typedef {import("../models/ProductItemModel.js").ProductItemDocument} ProductItemDocument
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
                id_user: user.id,
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

    static async getCustomerPaymentMethods(customerId) {
        const stripe = this.getStripe();

        const response = await stripe.customers.listPaymentMethods(customerId);

        return response.data.map((pm) => this.paymentMethodToObject(pm));
    }

    /**
     * @param {UserDocument} user
     */
    static async getUserPaymentMethods(user) {
        const customer = await this.findOrCreateCustomer(user);

        return this.getCustomerPaymentMethods(customer.id);
    }

    /**
     * @param {UserDocument} user
     * @param {string} customerId
     */
    static async getCustomerPaymentMethod(user, customerId) {
        const stripe = this.getStripe();

        const stripeUser = await this.getStripeUser(user);

        if (!stripeUser) {
            throw new Error("Must create stripe user first");
        }

        if (!stripeUser.id_card) {
            const methods = await this.getUserPaymentMethods(user);

            if (methods?.length) {
                stripeUser.id_card = methods[0].id;
                await getPrisma().stripeUser.update({
                    where: {
                        id_stripe_user: stripeUser.id_stripe_user,
                    },
                    data: {
                        id_card: stripeUser.id_card,
                    },
                });
            }
        }

        if (!stripeUser.id_card) {
            return null;
        }

        const pm = await stripe.customers.retrievePaymentMethod(
            customerId,
            stripeUser.id_card
        );

        return this.paymentMethodToObject(pm);
    }

    /**
     * @param {UserDocument} user
     */
    static async getUserDefaultPaymentMethod(user) {
        const customer = await this.findOrCreateCustomer(user);

        return this.getCustomerPaymentMethod(user, customer.id);
    }

    /**
     *
     * @param {UserDocument} user
     * @param {string} paymentMethodId
     */
    static async savePaymentMethod(user, paymentMethodId) {
        const stripeUser = await this.getStripeUser(user);
        if (!stripeUser) {
            throw new Error("Save payment method: Stripe user not found");
        }

        const stripe = this.getStripe();

        const paymentMethod = await stripe.paymentMethods.attach(
            paymentMethodId,
            {
                customer: stripeUser.id_external,
            }
        );

        await getPrisma().stripeUser.update({
            where: {
                id_stripe_user: stripeUser.id_stripe_user,
            },
            data: {
                id_card: paymentMethod.id,
            },
        });

        return this.paymentMethodToObject(paymentMethod);
    }

    /**
     * @param {Stripe.PaymentMethod} paymentMethod
     */
    static paymentMethodToObject(paymentMethod) {
        if (!paymentMethod) {
            return false;
        }

        if (paymentMethod.type === "card") {
            const { display_brand, exp_month, exp_year, last4 } =
                paymentMethod.card;

            return {
                display_brand,
                exp_month,
                exp_year,
                last4,
                id: paymentMethod.id,
            };
        }

        throw new Error("Unrecognized payment type: " + paymentMethod.type);
    }

    /**
     * @param {UserDocument} user
     * @param {ProductItemDocument[]} items
     */
    static async chargeUserForItems(user, items) {
        const prisma = getPrisma();
        const stripe = this.getStripe();

        const stripeUser = await this.getStripeUser(user);
        if (!stripeUser) {
            throw new Error("Customer not configured on payment gateway");
        }

        const customer = await this.getStripeCustomer(stripeUser);
        if (!customer) {
            throw new Error("External customer data not found");
        }

        const paymentMethod = await this.getCustomerPaymentMethod(
            user,
            customer.id
        );

        if (!paymentMethod) {
            throw new Error("Could not verify payment method");
        }

        const amountRaw = items.reduce((total, item) => {
            return total + item.bid.amount;
        }, 0);

        const amountAdjusted = Math.floor(amountRaw * 100);

        try {
            const result = await prisma.$transaction(async (tx) => {
                let purchase = await tx.purchase.create({
                    data: {
                        id_user: user.id,
                    },
                });

                const return_url =
                    getEnvHost() +
                    "/account/transactions/" +
                    purchase.id_purchase;

                const payload = {
                    amount: amountAdjusted,
                    currency: "usd",
                    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
                    automatic_payment_methods: { enabled: true },
                    customer: customer.id,
                    payment_method: paymentMethod.id,
                    return_url,
                    off_session: true,
                    confirm: true,
                };

                console.log("payload was", payload);

                const paymentIntent = await stripe.paymentIntents.create(
                    payload
                );

                // save external ID to purchase
                purchase = await tx.purchase.update({
                    where: {
                        id_purchase: purchase.id_purchase,
                    },
                    data: {
                        id_transaction_external: paymentIntent.id,
                    },
                });

                // update items with purchase id
                await tx.productItem.updateMany({
                    where: {
                        id_item: {
                            in: items.map((i) => i.id_item),
                        },
                    },
                    data: {
                        id_purchase: purchase.id_purchase,
                        status: "purchased",
                        purchasedAt: new Date(),
                    },
                });

                return purchase;
            });

            console.log("result was", result);

            return result;
        } catch (err) {
            console.warn("Caught error charging stripe", err);
            if (err.type?.startsWith("Stripe")) {
                throw new UserError(err.raw.message);
            }

            throw new Error(err.message);
        }
    }
}
