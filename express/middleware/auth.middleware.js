import _ from "lodash-es";
import AuthenticationSessionStore from "../utils/authenticationSession.js";

export const getToken = async function (req) {
    const payload = await AuthenticationSessionStore.consumeToken(req);
    if (payload.status && payload.status !== 200) {
        var err = new Error(payload.message);
        err.status = payload.status;
        throw err;
    }

    return payload;
};
export const hasAuth = async function (req, res, next) {
    try {
        console.log("before said");
        req.auth = await getToken(req);
        if (typeof next == "function") {
            next();
        }
        console.log("next was", next);
    } catch (err) {
        console.log("erroring out", err);
        next(err);
    }
};

export const hasUser =
    (fetch = "session.payload.user") =>
    async (req, res, next) => {
        await hasAuth(req, res, null);

        if (!req.auth) {
            var err = new Error(
                "hasUser can only be called after an authenticate"
            );
            err.code = 400;
            return next(err);
        }

        const user = _.get(req, fetch);

        if (!user || !user.id) {
            var err = new Error("hasUser(), userId not found");
            err.code = 404;
            return next(err);
        }

        req.user = user;

        next();
    };

export const hasAccessLevel = (accessLevels = []) =>
    async function (req, res, next) {
        if (!accessLevels.length) {
            return res.status(500).json({
                message: "hasAccessLevels() requires at least one access level",
            });
        }

        try {
            req.auth = await getToken(req);
        } catch (err) {
            return next(err);
        }

        const accessLevel = _.get(req.auth, "accessLevel");

        if (!accessLevel) {
            return res.status(401).json({ message: "Access level not found" });
        }
        if (accessLevels.indexOf(accessLevel) === -1) {
            return res.status(401).json({ message: "Access level denied" });
        }

        next();
    };

export const isAuthAccountId = (getAccountId) =>
    async function (req, res, next) {
        if (!req.auth) {
            return res.status(500).json({
                message:
                    "isAuthAccountId middleware should not be called before an authentication method",
            });
        }
        let accountId;
        try {
            accountId = await getAccountId(req);
        } catch (err) {
            console.warn("isAuthAccountId threw error", err);
            return next(err);
        }

        if (!accountId) {
            return res.status(500).json({
                message:
                    "isAuthAccountId failed to get account id through callback given",
            });
        }

        if (accountId != req.auth.accountId) {
            return res.status(401).json({
                message: "Cannot update document belonging to other account",
            });
        }

        next();
    };
