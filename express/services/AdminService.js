import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

export default class AdminService {
    static async getUsers() {
        const userModel = new UserModel();

        const users = await userModel.table.findMany({
            where: {
                role: "user",
            },
            orderBy: [
                {
                    name: "asc",
                },
                {
                    createdAt: "desc",
                },
            ],
        });

        return users.map((user) => userModel.toObject(user));
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
            // include: {
            //     categories: true,
            // },
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
}
