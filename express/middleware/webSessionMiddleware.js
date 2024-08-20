const webSessionMiddleware = async (req, res, next, sessionRequired = true) => {
    if (sessionRequired && !req.session?.user?.id) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    next();
};

webSessionMiddleware.optional = (req, res, next) =>
    webSessionMiddleware(req, res, next, false);

export default webSessionMiddleware;
