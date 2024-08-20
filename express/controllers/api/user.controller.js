import BaseController from "../_.controller.js";
import _, { pick } from "lodash-es";
import moment from "moment";
import validator from "validator";

import webSessionMiddleware from "../../middleware/webSessionMiddleware.js";

import UserError from "../../errors/UserError.js";
import { hasUser } from "../../middleware/auth.middleware.js";
import UserModel from "../../models/UserModel.js";
import { hasRecaptcha } from "../../middleware/recaptcha.middleware.js";

class UserController extends BaseController {
    base = "/user";

    constructor() {
        super();
    }
    initRoutes() {
        this.router.post(
            "/login",
            // webSessionMiddleware.optional,
            this.route(this.userLogin)
        );
        this.router.post(
            "/logout",
            webSessionMiddleware,
            hasUser(),
            this.route(this.userLogout)
        );
        this.router.post(
            "/register",
            webSessionMiddleware.optional,
            hasRecaptcha((req) => req.body.token),
            this.route(this.userRegister)
        );

        this.router.get("/test", (req, res) => {
            res.json({ message: "test" });
        });

        this.router.get(
            "/",
            webSessionMiddleware,
            hasUser(),
            this.route(this.getUser)
        );
    }

    async getUser(req, res) {
        const user = req.user;

        return res.json(user);
    }

    async userLogout(req, res) {
        req.session.destroy();
        res.json({
            status: "success",
            message: "You've been successfully logged out",
        });
    }

    async userLogin(req, res) {
        const session = req.session;

        if (!req.body.email) {
            return res.status(401).json({
                message: "Email is required",
            });
        }
        if (!req.body.password) {
            return res.status(401).json({
                message: "Password is required",
            });
        }

        const userModel = new UserModel();

        const user = await userModel.findByEmail(req.body.email);

        if (!user) {
            return res.status(404).json({
                message: "Email not found",
            });
        }

        if (!(await userModel.validateUserPassword(user, req.body.password))) {
            return res.status(401).json({
                message: "Email/password did not match our records",
            });
        }

        session.user = userModel.toObject(user);

        res.json({
            user: userModel.toObject(user),
            status: "success",
            message: "You've been successfully logged in",
        });
    }

    async userRegister(req, res) {
        const session = req.session;
        const userModel = new UserModel();

        if (!req.body.email || !validator.isEmail(req.body.email)) {
            return res.status(401).json({
                message: "Email is required",
            });
        }
        if (!req.body.password || req.body.password?.length < 6) {
            return res.status(401).json({
                message: "Password is required",
            });
        }
        if (!req.body.name || req.body.name?.length < 2) {
            return res.status(401).json({
                message: "Name is required",
            });
        }

        try {
            const user = await userModel.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });

            session.user = userModel.toObject(user);

            res.json({
                user: userModel.toObject(user),
                status: "success",
                message: "You've been successfully logged in",
            });
        } catch (err) {
            if (err instanceof UserError) {
                return res.status(401).json({
                    message: err.message,
                });
            }

            console.warn("Caught error creating user", err);

            return res.status(500).json({
                message: "An unknown error occurred creating user",
            });
        }
    }
}

export default UserController;
