import _ from "lodash-es";

/**
 * @typedef {import("@prisma/client").User} UserDocument
 */

export const hasUser =
    (fetch = "session.user") =>
    async (req, res, next) => {
        const user = _.get(req, fetch);

        if (!user || !user.id) {
            var err = new Error("hasUser(), userId not found");
            err.code = 404;
            return next(err);
        }

        req.user = user;

        next();
    };

/**
 * @param {UserDocument['role'][]} accessLevels
 */
export const hasAccessLevel = (accessLevels = []) =>
    async function (req, res, next) {
        if (!accessLevels.length) {
            return res.status(500).json({
                message: "hasAccessLevels() requires at least one access level",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "User must be set before checking access levels",
            });
        }

        const accessLevel = req.user.role;

        if (!accessLevel) {
            return res.status(401).json({ message: "Access level not found" });
        }
        if (accessLevels.indexOf(accessLevel) === -1) {
            return res.status(401).json({ message: "Access level denied" });
        }

        next();
    };
