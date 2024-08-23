import UserError from "../errors/UserError.js";
import ImageModel from "../models/ImageModel.js";
import ProductModel from "../models/ProductModel.js";

export default class ProductService {
    static async updateProductDetails(idProduct, detailItems) {
        if (!Array.isArray(detailItems)) {
            return res
                .status(400)
                .json({ message: "Product items should be an array" });
        }

        if (
            detailItems.some((item) => {
                return (
                    Object.keys(item).length !== 2 ||
                    !item.label ||
                    !item.description
                );
            })
        ) {
            return res.status(400).json({
                message:
                    "Malformed product item data. Must have label and description keys",
            });
        }

        const productModel = new ProductModel();
        return productModel.update(idProduct, { detailItems });
    }
    static async getProductImages(idProduct) {
        const imageModel = new ImageModel();
        return imageModel.findByResource("product", idProduct);
    }

    static async updateProduct(id, toSet) {
        const productModel = new ProductModel();
        const prev = await productModel.table.findFirst({
            where: { id_product: id },
        });
        if (!prev) {
            throw new UserError("Product not found: " + id);
        }

        if (typeof toSet.remainingQuantity === "undefined") {
            toSet.remainingQuantity = toSet.initialQuantity;
        }

        const product = await productModel.update(id, toSet);

        if (product.status === "active" && prev.status !== product.status) {
            ProductService.launchNextBatch(product);
        }

        return product;
    }

    static async launchNextBatch(product) {
        console.log("TODO: Launch launch!", product);
    }

    static async createProduct(data) {
        const productModel = new ProductModel();
        const created = await productModel.create(data);

        return created;
    }

    static async getPaginatedProducts({
        status,
        page,
        limit,
        withCategories = true,
    }) {
        const productModel = new ProductModel();
        const total = await productModel.table.count({
            where: {
                status: {
                    in: status,
                },
            },
        });

        const rows = await productModel.table.findMany({
            where: {
                status: {
                    in: status,
                },
            },
            include: {
                categories: true,
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: page * limit - limit,
        });

        return {
            limit,
            page,
            rows,
            total,
            pages: Math.ceil(total / limit),
        };
    }

    static async getProductById(idProduct) {
        const productModel = new ProductModel();
        const product = await productModel.table.findFirst({
            where: {
                id_product: idProduct,
            },
            include: {
                categories: true,
                tags: true,
            },
        });

        product.images = await ProductService.getProductImages(idProduct);

        return product;
    }
}
