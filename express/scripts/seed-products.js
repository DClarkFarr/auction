import { parseArgs, app } from "./cli.js";

import { getPrisma } from "../prisma/client.js";
import { fakeProduct } from "./seed/methods.js";
import ProductModel from "../models/ProductModel.js";
import { faker } from "@faker-js/faker";

const args = parseArgs({
    args: [],
    options: [{ name: "quantity", type: Number, required: false, default: 20 }],
});

if (args._unknown && args._unknown.length) {
    throw new Error(
        "Missing the following arguments/options: " + args._unknown.join(", ")
    );
}

console.log("ready to go");

const seedPrducts = async function () {
    try {
        const quantity = args.quantity || 20;

        await app.connectToDb();

        const client = getPrisma();

        const categories = await client.category.findMany();
        const tags = await client.tag.findMany();
        const images = await client.image.findMany({
            where: {
                resourceType: "product",
            },
        });

        const createProduct = async () => {
            const toCreateProduct = fakeProduct();
            const productModel = new ProductModel();

            const product = await productModel.create(toCreateProduct);

            const category = faker.helpers.arrayElement(categories);

            await client.productCategories.create({
                data: {
                    categoryId: category.id_category,
                    productId: product.id_product,
                },
            });

            await Promise.all(
                faker.helpers
                    .arrayElements(tags, { min: 1, max: 5 })
                    .map((tag) => {
                        return client.productTags.create({
                            data: {
                                productId: product.id_product,
                                tagId: tag.id_tag,
                            },
                        });
                    })
            );

            await Promise.all(
                faker.helpers
                    .arrayElements(images, { min: 3, max: 8 })
                    .map(async (image) => {
                        const obj = { ...image };
                        delete obj.id_image;
                        obj.resourceId = product.id_product;

                        await client.image.create({
                            data: obj,
                        });
                    })
            );
        };

        for (let i = 0; i < quantity; i++) {
            await createProduct();
        }

        process.exit();
    } catch (err) {
        console.log("error executing script", err.message);
        process.exit(1);
    }
};

const output = seedPrducts();
