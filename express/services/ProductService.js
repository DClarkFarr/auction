import UserError from "../errors/UserError.js";
import ImageModel from "../models/ImageModel.js";
import ProductModel from "../models/ProductModel.js";

export default class ProductService {
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
}
