import ImageModel from "../models/ImageModel.js";

export default class ProductService {
    static async getProductImages(idProduct) {
        const imageModel = new ImageModel();
        return imageModel.findByResource("product", idProduct);
    }
}
