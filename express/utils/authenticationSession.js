import jwt from "jsonwebtoken";
import { env } from "./environment.js";
import { DateTime } from "luxon";

class AuthenticationSessionStore {
    static decodeJwt(token) {
        let payload = null;
        try {
            payload = jwt.decode(token, env("jwt.secret"));
        } catch (err) {
            // handle error
            console.warn("decodeJwt()", err);
        }
        return payload;
    }

    static async consumeToken(req, required = true) {
        let result = {
            status: 200,
            message: "Token valid",
            payload: {},
        };

        if (!required && !req.headers.authorization) {
            result.message = "No Token";
            return result;
        }

        if (!req.headers.authorization) {
            result.status = 401;
            result.message =
                "Please make sure your request has an authorization header";
            return result;
        }

        let token = req.headers.authorization.split(" ")[1];
        let type = req.headers.authorization.split(" ")[0];
        let payload;

        switch (type) {
            case "Bearer":
                payload = this.decodeJwt(token);
                break;
            default:
                result.status = 401;
                result.message = "Invalid token type.  Must be type Bearer";
                return result;
        }

        if (!payload) {
            result.status = 401;
            result.message = "Unable to decode button";
            return result;
        }

        if (payload.exp <= DateTime.now().toUnixInteger()) {
            result.status = 401;
            result.message = "Token has expired";
            return result;
        }

        result.payload = payload;
        return result;
    }
}

export default AuthenticationSessionStore;
