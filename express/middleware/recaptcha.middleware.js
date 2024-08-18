import axios from "axios";
export const hasRecaptcha = (getToken) =>
    async function (req, res, next) {
        try {
            const { success, score, ...other } = await axios
                .post(
                    "https://www.google.com/recaptcha/api/siteverify",
                    {
                        secret: process.env.RECAPTCHA_SECRET,
                        response: getToken(req),
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                )
                .then((res) => res.data);

            if (!success || score < 0.5) {
                return res.status(401).json({
                    message: "Recaptcha failed",
                    errors: other["error-codes"],
                });
            }

            if (typeof next === "function") {
                next();
            }
        } catch (err) {
            next(err);
        }
    };
