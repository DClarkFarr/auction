// Middleware to check for SQL or JavaScript injection attempts
export function injectionCheck(req, res, next) {
    const injectionPatterns = [
        /(;|\|\||&&|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bTRUNCATE\b)/i, // SQL keywords and operators
        /(\bSCRIPT\b|<|>|\bon\w+=|`)/i, // JavaScript keywords, tags, and attributes
    ];

    const checkForInjection = (value) => {
        if (typeof value === "string") {
            return injectionPatterns.some((pattern) => pattern.test(value));
        }
        if (typeof value === "object" && value !== null) {
            return Object.values(value).some(checkForInjection);
        }
        return false;
    };

    if (checkForInjection(req.body)) {
        return res
            .status(400)
            .json({ error: "Potential SQL or JavaScript injection detected." });
    }

    next(); // Continue to the next middleware or route handler
}
