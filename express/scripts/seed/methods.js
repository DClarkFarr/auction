import { faker } from "@faker-js/faker";
import { toSlug } from "../../utils/slug.js";
import { DateTime } from "luxon";
/**
 * @typedef {import("@prisma/client").Product} ProductDocument
 * @typedef {Omit<ProductDocument, "id_product" | "createdAt" | "updatedAt">} ProductBody
 */

function getDate() {
    return faker.date.between({
        from: DateTime.now().minus({ days: 30 }).toJSDate(),
        to: DateTime.now().plus({ days: 30 }).toJSDate(),
    });
}

/**
 * @param {Partial<ProductBody>} overrides
 * @returns {ProductBody}
 */
export function fakeProduct(overrides = {}) {
    const name =
        faker.commerce.productName() + " - " + faker.commerce.product();
    const priceCost = Number(faker.commerce.price({ min: 1, max: 10 }));
    const initialQuantity = faker.helpers.rangeToNumber({ min: 5, max: 50 });

    const statuses = ["active", "inactive"];
    /**
     * @type {ProductBody}
     */
    const body = {
        sku: faker.lorem.slug(),
        name,
        slug:
            toSlug(name) +
            "--" +
            faker.helpers.rangeToNumber({ min: 100000, max: 999999 }),
        priceCost,
        priceInitial: priceCost * 1.5,
        priceRetail: priceCost * 3.5,
        initialQuantity,
        remainingQuantity: faker.helpers.rangeToNumber(
            Math.floor(initialQuantity / 2),
            initialQuantity
        ),
        quality: faker.helpers.rangeToNumber({ min: 2, max: 5 }),
        auctionBatchCount: faker.helpers.rangeToNumber(1, 3),
        description: faker.commerce.productDescription(),
        status: faker.helpers.arrayElement(statuses),
        detailItems: Array.from({ length: 5 }, () => ({
            label: faker.lorem.words({ min: 2, max: 5 }),
            description: faker.lorem.words({ min: 15, max: 30 }),
        })),
        createdAt: getDate(),
        ...overrides,
    };

    return body;
}
