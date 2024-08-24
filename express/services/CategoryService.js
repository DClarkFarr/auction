import CategoryModel from "../models/CategoryModel.js";
export default class CategoryService {
    static async getCategories() {
        const categoryModel = new CategoryModel();

        return categoryModel.table.findMany({
            orderBy: {
                label: "asc",
            },
        });
    }
}
