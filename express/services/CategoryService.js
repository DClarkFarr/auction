import CategoryModel from "../models/CategoryModel.js";
import TagModel from "../models/TagModel.js";
export default class CategoryService {
    static async getCategories() {
        const categoryModel = new CategoryModel();

        return categoryModel.table.findMany({
            orderBy: {
                label: "asc",
            },
        });
    }

    static async getTags() {
        const tagModel = new TagModel();

        return tagModel.table.findMany({
            orderBy: {
                label: "asc",
            },
        });
    }
}
