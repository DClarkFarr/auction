import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

import { app } from "./app.js";

import { createEnvironment, env } from "./utils/environment.js";

import WebController from "./controllers/web.controller.js";
import ApiController from "./controllers/api.controller.js";

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
})
    .then(() => app.configureExpress())
    .then(() => {
        app.registerControllers([new ApiController(), new WebController()]);

        app.registerErrorHandler();

        return app
            .connectToDb()
            .then(() => {
                return app.listen();
            })
            .then(async (port) => {
                console.log("listening to port", port);

                setTimeout(() => {
                    if (env("env") == "production") {
                        console.log("scheduling cron");

                        // schedule to run at 10PM every 5 days
                        cron.schedule("0 22 */5 * *", async () => {
                            queueService.add(async () => {
                                try {
                                    console.log("log result here");
                                } catch (err) {
                                    console.log("log error here");
                                }
                            });
                        });
                    }
                }, 2000);
            });
    });
