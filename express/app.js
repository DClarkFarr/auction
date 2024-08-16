import express from "express";

//configure express
import bodyParser from "body-parser";

//error handler
import defaultErrorHandler from "./middleware/errorHandler.middleware.js";

//database
import http from "http";
import { env } from "./utils/environment.js";
import { getPrisma } from "./prisma/client.js";

class App {
    express = false;
    httpServer = false;

    /**
     * @type {ReturnType<typeof getPrisma>}
     */
    db = null;
    constructor() {
        this.express = express();
    }

    configureExpress() {
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());

        const allowedOrigins = env("allowedOrigins");
        const productionWeb = env("endpoint.production.web");

        this.express.use((req, res, next) => {
            const incomingOrigin = req.header("Origin");
            const origin =
                allowedOrigins.indexOf(incomingOrigin) > -1
                    ? incomingOrigin
                    : productionWeb;

            res.header("Access-Control-Allow-Credentials", "true");
            res.header(
                "Access-Control-Expose-Headers",
                "x-token, x-csrf-token"
            );
            res.header(
                "Access-Control-Allow-Headers",
                "Authorization, Content-Type, x-csrf-token, x-xsrf-token"
            );
            res.header(
                "Access-Control-Allow-Methods",
                "OPTION, GET, POST, PUT, DELETE"
            );
            res.header("Access-Control-Allow-Origin", origin);
            res.header("Content-Security-Policy", "frame-ancestors");
            res.header("X-Frame-Options", "SAMEORIGIN");
            next();
        });
    }
    registerControllers(controllers = []) {
        controllers.forEach((c) => {
            this.express.use(c.base, c.router);
        });
    }
    registerErrorHandler(handlerCallback = null) {
        this.express.use(handlerCallback || defaultErrorHandler);
    }

    host() {
        const env = env("env");
        return env(`endpoint.${env}.web`);
    }

    listen() {
        return new Promise((resolve) => {
            const port = env("port");
            this.server = http.createServer(this.express);
            this.server.listen(port, () => {
                resolve(port);
            });
            this.server.timeout = 3e5;
        });
    }

    async connectToDb() {
        this.db = getPrisma();
    }
}

export const app = new App();
