import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

import { app } from "./app.js";

import { createEnvironment, env } from "./utils/environment.js";

import WebController from "./controllers/web.controller.js";
import ApiController from "./controllers/api.controller.js";
import CronService from "./services/CronService.js";
import QueueService from "./services/QueueService.js";

createEnvironment({
    PORT: process.env.PORT,
    ENV: process.env.ENV,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_SOCKET: process.env.DB_SOCKET,
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    STRIPE_SECRET: process.env.STRIPE_SECRET_KEY,
    SOCKET_ORIGIN: process.env.SOCKET_ORIGIN,
})
    .then(() => app.configureExpress())
    .then(async () => {
        app.registerControllers([new ApiController(), new WebController()]);

        app.registerErrorHandler();

        await app.initSocket();

        return app
            .connectToDb()
            .then(() => {
                return app.listen();
            })
            .then(async (port) => {
                console.log("listening to port", port);

                const queueService = new QueueService();

                setTimeout(() => {
                    console.log("scheduling cron");

                    cron.schedule("0,30 * * * *", async () => {
                        queueService.add(async () => {
                            console.log("syncing active products");
                            const res = await CronService.syncActiveProducts();
                            console.log("active products synced", res);
                        });
                    });
                }, 2000);
            });
    });
