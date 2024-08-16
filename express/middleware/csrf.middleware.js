import csrf from "csurf";

export const requestConfig = csrf({ cookie: true });

export const csrfRequest = () => {
    return requestConfig;
};

export const csrfResponse = (req, res, next) => {
    return requestConfig(req, res, () => {
        if (req.method == "GET") {
            res.header("x-csrf-token", req.csrfToken());
        }
        next();
    });
};
