import jwt from "jsonwebtoken";
import { env } from "../utils/environment.js";
import { DateTime } from "luxon";

class WebSession {
    payload = null;
    message = "";
    status = "";
    changed = false;
    changed = false;

    constructor(payload = {}, message = "", status = 200) {
        this.message = message;
        this.status = status;

        this.payload = {
            user: null,
            notificationToken: null,
            ...payload,
            exp: parseInt(DateTime.now().plus({ days: 1 }).toUnixInteger()),
        };
    }
    bindRoute(req, res) {
        this.getReq = () => req;
        this.getRes = () => res;
    }

    addUser(user) {
        this.payload.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
        this.changed = true;
    }
    addNotificationToken(notificationToken) {
        this.payload.notificationToken = notificationToken;
        this.changed = true;
    }

    hasUser() {
        return this.payload && this.payload.user && this.payload.user.id;
    }
    hasNotificationToken() {
        return this.payload && this.payload.notificationToken;
    }
    getToken() {
        return jwt.sign(this.payload, env("jwt.secret"));
    }
    save() {
        if (this.silent) {
            return false;
        }
        this.getRes().header("x-token", this.getToken());
        this.changed = false;
    }
    isGet() {
        this.changed = false;
        this.silent = true;
        this.getRes().removeHeader("x-token");
        return this;
    }
    isGet() {
        this.changed = false;
        this.silent = true;
        this.getRes().removeHeader("x-token");
        return this;
    }

    isChanged() {
        return this.changed;
    }
}

export default WebSession;
