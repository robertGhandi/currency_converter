import rateLimit from "express-rate-limit";
import logger from '../utils/logger.js';

const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, 
    legacyHeaders: false, 
    message: {
        status: "error",
        message: "Too many requests, please try again later.",
    },

    handler: (req, res, next, options) => {
        logger.warn("Rate limit exceeded", { ip: req.ip, method: req.method, path: req.path });
        res.status(options.statusCode).json({
            status: "error",
            message: options.message,
        });
    }
});

export default apiRateLimiter;
