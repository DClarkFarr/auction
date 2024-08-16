import { parseArgs, app } from "./cli.js";

import Models from "../models/index.js";

const args = parseArgs({
    args: ["account_name"],
    options: [
        { name: "email", type: String, required: true },
        { name: "password", type: String, required: true },
        { name: "first_name", type: String, required: true },
        { name: "last_name", type: String, required: true },
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
        await app.connectToDb();

        const account = await Models.Account.create({
            name: args.account_name,
        });

        console.log("account", account);

        const admin = await account.createAdmin({
            firstName: args.first_name,
            lastName: args.last_name,
            email: args.email,
            password: args.password,
            accessLevel: "owner",
        });

        console.log("admin", admin);
        process.exit();
    } catch (err) {
        console.log("error executing script", err.message);
        process.exit(1);
    }
};

const output = createAccount();

return output;
