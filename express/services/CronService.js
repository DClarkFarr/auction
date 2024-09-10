import { DateTime } from "luxon";
import { getPrisma } from "../prisma/client.js";
import ProductService from "./ProductService.js";

export default class CronService {
    static async syncActiveProducts() {
        const prisma = getPrisma();
        const activeProducts = await prisma.product.findMany({
            where: {
                status: "active",
            },
        });

        const results = await Promise.all(
            activeProducts.map(async (product) => {
                /**
                 * Update by each status
                 */
                let status = "unchanged";

                /**
                 * show changed item id, status before, status after
                 */
                const items = [];

                const productItems = await prisma.productItem.findMany({
                    where: {
                        id_product: product.id_product,
                        status: {
                            in: ["active", "claimed"],
                        },
                    },
                });

                if (!productItems.length) {
                    if (product.remainingQuantity > 0) {
                        items.push(
                            ...(await ProductService.publishNextBatch(product))
                        );

                        status = "next-batch'";
                    } else {
                        /**
                         * No active products or remaining inventory, set product to status = sold
                         */
                        await ProductService.markSoldProduct(product);

                        status = "sold";
                    }
                } else {
                    await Promise.all(
                        productItems.map(async (item) => {
                            const now = DateTime.now();

                            if (item.purchasedAt) {
                                throw new Error(
                                    "Why is purcased item still active?"
                                );
                            }

                            if (item.rejectedAt) {
                                throw new Error(
                                    "Why is rejected item still active?"
                                );
                            }

                            if (item.rejectsAt) {
                                /**
                                 * If rejects at, then product was bid on.
                                 * User will have 24 hours to claim
                                 */

                                const rejectsAt = DateTime.fromJSDate(
                                    item.rejectsAt
                                );
                                if (now > rejectsAt) {
                                    const result =
                                        await ProductService.publishProductItemStatus(
                                            product,
                                            item,
                                            "rejected"
                                        );

                                    product = result.product;

                                    items.push({
                                        id_item: item.id_item,
                                        status: "rejected",
                                    });

                                    items.push(...result.publishedItems);
                                }
                            } else {
                                const expiresAt = DateTime.fromJSDate(
                                    item.expiresAt
                                );
                                if (now > expiresAt) {
                                    const highestBid =
                                        await ProductService.getProductItemHighestBid(
                                            item
                                        );

                                    /**
                                     * @type {ReturnType<ProductService.publishProductItemStatus>}
                                     */
                                    let result;
                                    if (highestBid) {
                                        result =
                                            await ProductService.publishProductItemStatus(
                                                product,
                                                item,
                                                "claimed",
                                                {
                                                    expiredAt: new Date(),
                                                    rejectsAt:
                                                        DateTime.fromJSDate(
                                                            item.expiredAt
                                                        )
                                                            .plus({ day: 1 })
                                                            .toJSDate(),
                                                    id_user: highestBid.id_user,
                                                }
                                            );
                                    } else {
                                        result =
                                            await ProductService.publishProductItemStatus(
                                                product,
                                                item,
                                                "expired"
                                            );
                                    }

                                    product = result.product;

                                    items.push({
                                        id_item: item.id_item,
                                        status: "expired",
                                    });

                                    items.push(...result.publishedItems);
                                }
                            }
                        })
                    );
                }

                if (product.remainingQuantity < 1) {
                    await ProductService.publishProductStatus(
                        product.id_product,
                        "sold"
                    );
                    status = "sold";
                }

                return {
                    id_product: product.id_product,
                    items,
                    status,
                };
            })
        );

        return results;
    }
}
