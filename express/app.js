import express from "express";

//configure express
import bodyParser from "body-parser";

//error handler
import defaultErrorHandler from "./middleware/errorHandler.middleware.js";

//database
import http from "http";
import { env } from "./utils/environment.js";
import { getPrisma } from "./prisma/client.js";
import session from "express-session";

import CreateMysqlStore from "express-mysql-session";

import mysql from "mysql2/promise";
import { createSocket } from "./utils/socket.js";

class App {
    express = false;
    server = false;

    /**
     * @type {import('socket.io').Server | null}
     */
    io = null;

    /**
     * @type {ReturnType<typeof getPrisma>}
     */
    db = null;
    constructor() {
        this.express = express();
        this.server = http.createServer(this.express);
        this.server.timeout = 3e5;
    }

    async initSocket() {
        this.io = new createSocket(this.server);

        this.io.on("connection", (socket) => {
            console.log("a user connected");
            socket.on("disconnect", () => {
                console.log("user disconnected");
            });
        });
    }

    async configureExpress() {
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

        /**
         * @type {import('mysql2').ConnectionOptions}
         */
        const sqlOptions = {
            host: env("db.host"),
            port: env("db.port"),
            user: env("db.user"),
            password: env("db.password"),
            database: env("db.name"),
        };

        const socket = env("db.socket");
        if (socket) {
            sqlOptions.socketPath = socket;
        }

        const connection = await mysql.createConnection(sqlOptions);

        const MySQLStore = CreateMysqlStore(session);
        const sessionStore = new MySQLStore(
            { createDatabaseTable: true },
            connection
        );

        /**
         * @type {import('express-session').SessionOptions}
         */
        const sessionConfig = {
            secret: env("session.secret"),
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
            store: sessionStore,
        };

        if (env("env") == "production") {
            this.express.set("trust proxy", 1); // trust first proxy
            sessionConfig.cookie.secure = true;
        }
        this.express.use(session(sessionConfig));

        await sessionStore
            .onReady()
            .then(() => {
                // MySQL session store ready for use.
                console.log("MySQLStore ready");
            })
            .catch((error) => {
                // Something went wrong.
                console.error("error initiating session sql connection", error);
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

    listen() {
        return new Promise((resolve) => {
            const port = env("port");

            this.server.listen(port, () => {
                resolve(port);
            });
        });
    }

    async connectToDb() {
        this.db = getPrisma();
    }
}

export const app = new App();
