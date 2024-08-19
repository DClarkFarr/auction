import { parseArgs, app } from "./cli.js";

import UserModel from "../models/UserModel.js";

const args = parseArgs({
    args: [],
    options: [
        { name: "email", type: String, required: true },
        { name: "password", type: String, required: true },
        { name: "name", type: String, required: true },
    ],
});

if (args._unknown && args._unknown.length) {
    throw new Error(
        "Missing the following arguments/options: " + args._unknown.join(", ")
    );
}

console.log("ready to go");

const createAccount = async function () {
    try {
        if (!args.email || !args.password || !args.name) {
            console.log("Please provide email, password and name");
            process.exit(1);
            return;
        }
        await app.connectToDb();

        const userModel = new UserModel();

        const admin = await userModel.create({
            name: args.name,
            email: args.email,
            password: args.password,
            role: "admin",
        });

        console.log("admin", admin);
        process.exit();
    } catch (err) {
        console.log("error executing script", err.message);
        process.exit(1);
    }
};

const output = createAccount();
