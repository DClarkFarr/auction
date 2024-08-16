import path from "path";
import { fileURLToPath } from "url";
import _ from "lodash-es";
import express from "express";
import cookieParser from "cookie-parser";
import BaseController from "./_.controller.js";

import notFound from "../middleware/notFound.middleware.js";
import { app } from "../app.js";

import { requestConfig, csrfResponse } from "../middleware/csrf.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WebController extends BaseController {
    base = "/";
    constructor() {
        super();
    }

    initRoutes() {
        app.express.use(
            express.static(path.join(__dirname, "../../web/dist/"))
        );
        app.express.use(cookieParser());

        this.router.use(requestConfig);

        this.router.use(function (err, req, res, next) {
            if (err.code !== "EBADCSRFTOKEN") return next(err);

            // handle CSRF token errors here
            res.status(403);
            res.send("Request tampered with");
        });

        this.router.get("*", csrfResponse, (req, res) => {
            res.cookie("XSRF-TOKEN", req.csrfToken());

            res.sendFile(path.join(__dirname, "../../", "web/dist/index.html"));
        });

        this.router.use(
            notFound((res) => {
                res.send(`<h1>Page route not found</h1>`);
            })
        );
    }
}

export default WebController;
