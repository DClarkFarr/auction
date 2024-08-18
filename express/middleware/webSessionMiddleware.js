import WebSession from "../utils/WebSession.js";
import AuthenticationSessionStore from "../utils/authenticationSession.js";

const webSessionMiddleware = async (req, res, next, sessionRequired = true) => {
    const { status, message, payload } =
        await AuthenticationSessionStore.consumeToken(req, sessionRequired);

    if (status !== 200) {
        return res.status(status).json({ message });
    }

    const session = new WebSession(payload || {}, message, status);

    session.bindRoute(req, res);

    req.session = session;

    console.log("calling next", next);
    next();
};

webSessionMiddleware.optional = (req, res, next) =>
    webSessionMiddleware(req, res, next, false);

export default webSessionMiddleware;
