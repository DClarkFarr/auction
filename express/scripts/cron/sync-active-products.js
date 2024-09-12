import { app } from "../cli.js";

import QueueService from "../../services/QueueService.js";
import CronService from "../../services/CronService.js";

const syncActiveAccounts = async function () {
    const queueService = new QueueService();

    try {
        await app.connectToDb();

        queueService.add(async () => {
            console.log("syncing active products");
            const res = await CronService.syncActiveProducts();
            console.log("active products synced", res);
        });
    } catch (err) {
        console.log("error executing script", err.message);
        process.exit(1);
    }
};

syncActiveAccounts();
