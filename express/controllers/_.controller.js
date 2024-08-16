import express from "express";

class BaseController {
    base; // extend
    router; // extend

    req;
    res;
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    /**
     * Initiation Methods
     */
    initRoutes() {
        console.warn("calling default initRoutes method");
    }
    registerControllers(controllers = []) {
        controllers.forEach((c) => {
            this.router.use(c.base, c.router);
        });
    }

    /**
     * Route Specific Methods
     */

    route(callback) {
        return (req, res) => {
            this.req = req;
            this.res = res;

            return callback.call(this, req, res);
        };
    }
    json(data) {
        return this.res.json(data);
    }
    error(message, status = 400, data = {}) {
        return this.res.status(status).json({ ...data, message });
    }
}

export default BaseController;
