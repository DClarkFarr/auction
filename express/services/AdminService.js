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
}
